import express from 'express';
import * as http from 'http';
import * as bodyParser from 'body-parser';
import * as path from 'path';
import IO from "socket.io";
import { PostgresUtils } from '../../db-management//utils/postgres.utils';
import { FileUtils } from '../../db-management/utils/file.utils';

export class DatabaseWatcherServer {
    private app: any;
    private server: any;
    private io: any;
    private client: any;
    private httpServer: any;
    private postgresUtils: PostgresUtils;
    private dbName: string;

    constructor() {
        this.dbName = process.argv[3];
        this.postgresUtils = new PostgresUtils();
        this.postgresUtils.setConnectionString('postgres://root:route@postgresdb:5432/' + this.dbName);
    }

    listenHere() {
        this.app = express();
        this.server = http.createServer(this.app);
        this.io = IO(this.server);
        this.app.use((req: any, res: any, next: any) => {
            res.header("Access-Control-Allow-Origin", "*");
            res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
            next();
        });

        this.app.use(bodyParser.urlencoded({ extended: true, limit: '50mb' }));
        this.app.use(bodyParser.json({ limit: '50mb' }));       // to support JSON-encoded bodies

        this.declareRoutes();

        this.server.listen(65064, (error: any) => {
            console.log('listening');
        });
    }

    private declareRoutes() {
        this.app.get('/status', (req: any, res: any) => {
            res.send({ data: true });
        });
    }
}