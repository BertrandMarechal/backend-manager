import express from 'express';
import * as http from 'http';
import * as bodyParser from 'body-parser';
import { KmsServer } from './kms-server';
import { LambdaServer } from './lambda-server';
import { PostgresUtils } from '../utils/postgres.utils';
import { S3Server } from './s3-server';
import IO from "socket.io";

const postgresDatabaseToUse = process.argv[2] ? 'localhost' : 'postgresdb';
const postgresPortToUse = process.argv[2] ? '5432' : '5433';

export class AwsServer {
    private app: any;
    private server: any;
    private kmsServer: KmsServer;
    private lambdaServer: LambdaServer;
    private s3Server: S3Server;
    private postgresUtils: PostgresUtils;
    private io: any;
    private clients: {
        [id: string]: any
    };

    constructor() {
        this.clients = {};
        this.postgresUtils = new PostgresUtils();
        this.postgresUtils.setConnectionString(`postgres://root:route@${postgresDatabaseToUse}:${postgresPortToUse}/postgres`);
        this.kmsServer = new KmsServer(this.postgresUtils);
        this.lambdaServer = new LambdaServer(this.postgresUtils);
        this.s3Server = new S3Server(this.postgresUtils);
    }

    static logServerEvents(message: string) {
        console.log('SERVER - ' + message);
    }

    listenHere() {
        this.app = express();
        this.server = http.createServer(this.app);
        this.io = IO(this.server);
        this.app.use((req: any, res: any, next: any) => {
            res.header("Access-Control-Allow-Origin", "*");
            res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,PATCH,OPTIONS');
            res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With, Accept, 0, undefined, Cache-Control, 1');
            // allow preflight
            // if (req.method === 'OPTIONS') {
            //     res.send(200);
            // } else {
            //     next();
            // }
            next()
        });

        this.app.use(bodyParser.urlencoded({ extended: true, limit: '50mb' }));
        this.app.use(bodyParser.json({ limit: '50mb' }));       // to support JSON-encoded bodies

        this.declareRoutes();
        
        this.io.on('connection', (client: any) => {
            this.attachSocket(client);
        });

        this.server.listen(65065, (error: any) => {
            if (error) {
                console.log(error);
            } else {
                console.log('listening on 65065');
            }
        });
    }
    private attachSocket(client: any) {
        console.log('Client connected: ' + client.conn.id + '');
        this.clients[client.conn.id] = client;

        client.on('disconnect', () => {
            console.log('Client disconnected: ' + client.conn.id + '');
            delete this.clients[client.conn.id];
        });

        this.lambdaServer.attachSocket(client, this.emitFromSubServer.bind(this));
        this.s3Server.attachSocket(client, this.emitFromSubServer.bind(this));
    }

    emitFromSubServer(event: string, data: any, clients?: string[]) {
        if (!clients) {
            clients = Object.keys(this.clients);
        }
        clients.forEach((clientId: string) => {
            this.clients[clientId].emit(event, data);
        });
    }

    static sendDataBack(result: any, res: any) {
        res.send(result);
    }

    static sendErrorBack(error: any, res: any) {
        res.send({ error: error });
    }

    private declareRoutes() {
        this.app.get('/', (req: any, res: any) => {
            console.log('/');
            res.status(200).send('<h2>Hello</h2><a href="http://localhost:65065/kms/d1d5sa-d15sa3d8-d45s5de-d4s5a/get?path=' + encodeURIComponent('my/super/tree') + '">kms</a>');
        });
        this.kmsServer.declareRoutes(this.app);
        this.lambdaServer.declareRoutes(this.app);
        this.s3Server.declareRoutes(this.app);
    }
}