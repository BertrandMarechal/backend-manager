import express from 'express';
import * as http from 'http';
import * as bodyParser from 'body-parser';
import { KmsServer } from './kms-server';



export class AwsServer {
    private app: any;
    private server: any;
    private kmsServer: KmsServer;

    constructor() {
        this.kmsServer = new KmsServer();
    }

    static logServerEvents(message: string) {
        console.log('SERVER - ' + message);
    }

    listenHere() {
        this.app = express();
        this.server = http.createServer(this.app);
        this.app.use((req: any, res: any, next: any) => {
            res.header("Access-Control-Allow-Origin", "*");
            res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
            next();
        });

        this.app.use(bodyParser.urlencoded({ extended: true, limit: '50mb' }));
        this.app.use(bodyParser.json({ limit: '50mb' }));       // to support JSON-encoded bodies

        this.declareRoutes();
        this.server.listen(65065, (error: any) => {
            if (error) {
                console.log(error);
            } else {
                console.log('listening on 65065');
            }
        });

    }

    static sendDataBack(result: any, res: any) {
        res.send({ data: result });
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
    }
}