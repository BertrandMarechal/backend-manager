import express from 'express';
import * as http from 'http';
import * as bodyParser from 'body-parser';
import * as path from 'path';
import IO from "socket.io";
import { PostgresUtils } from '../../utils/postgres.utils';
import { FileUtils } from '../../utils/file.utils';
import { DatabaseWatcherInstaller } from './database-watcher-installer';

export class DatabaseWatcherServer {
    private app: any;
    private server: any;
    private io: any;
    private client: any;
    private httpServer: any;
    private databaseWatcherInstaller: DatabaseWatcherInstaller;

    constructor() {
        this.databaseWatcherInstaller = new DatabaseWatcherInstaller();
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
        this.app.use(bodyParser.json({ limit: '50mb' }));

        this.declareRoutes();

        this.server.listen(65064, (error: any) => {
            console.log('listening');
            this.databaseWatcherInstaller.runChecks()
                .then(() => {
                    this.databaseWatcherInstaller.install();
                })
                .catch((error: any) => {
                    console.log(error);
                    
                });
        });
    }

    private declareRoutes() {
        this.app.get('/', (req: any, res: any) => {
            res.send('<a href="/status">Status</a><br/><a href="/stop">Stop</a>');
        });
        this.app.get('/status', (req: any, res: any) => {
            res.send({ data: this.databaseWatcherInstaller.state });
        });
        this.app.get('/available', (req: any, res: any) => {
            res.send({ data: this.databaseWatcherInstaller.isAvailable() });
        });
        this.app.get('/stop', (req: any, res: any) => {
            this.server.stop();
            res.send({ data: true });
        });
    }
}