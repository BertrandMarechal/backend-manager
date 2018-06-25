import express from 'express';
import * as http from 'http';
import * as bodyParser from 'body-parser';
import * as path from 'path';
import IO from "socket.io";
import {PostgresUtils} from '../utils/postgres.utils';
import { FileUtils } from '../utils/file.utils';
import { DatabaseManagement } from './database-management';
import { RepositoryReader } from './repository-reader';
import { log } from 'util';


export class ManagementServer {
    private app: any;
    private server: any;
    private io: any;
    private client: any;
    private httpServer: any;
    private postgresUtils: PostgresUtils;
    private databaseManagement: DatabaseManagement;
    private repositories?: {name: string, isDatabase: boolean, isMiddleTier: boolean}[];
    private databases?: any;
    private repositoryReader: RepositoryReader;

    constructor() {
        console.log(process.argv[2]);
        this.postgresUtils = new PostgresUtils();
        this.databaseManagement = new DatabaseManagement();
        this.repositoryReader = new RepositoryReader(this.databaseManagement);
        if (process.argv[2]) {
            this.postgresUtils.setConnectionString('postgres://root:route@localhost:5432/postgres');
        } else {
            this.postgresUtils.setConnectionString('postgres://root:route@postgresdb:5432/postgres');
        }
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
            res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
            next();
        });

        this.app.use(bodyParser.urlencoded({ extended: true, limit: '50mb' }));
        this.app.use( bodyParser.json({limit: '50mb'}) );       // to support JSON-encoded bodies
        
        this.declareRoutes();
        if (process.argv[2]) {
            this.runDatabaseInitializationSctipt();
        }
        this.server.listen(process.argv[2]? 690 : 8080, (error: any) => {
            console.log('listening');
        });

    }

    private runDatabaseInitializationSctipt() {
        console.log('This step is made to run the SQL scripts on starting the ser on local use.');
        console.log('WAIT FOR IT TO END before doing anything.');
        console.log('REMOVE it on real use case.');
        console.log('### STARTING ###');
        return new Promise((resolve, reject) => {
            FileUtils.getFileList({
                startPath: '../postgres/scripts',
                filter: /\.sql/
            })
            .then((fileList) => {
                console.log(fileList.length + ' files to run');

                this.runFiles(fileList)
                    .then(resolve)
                    .catch(reject);
            });
        });
    }

    private runFiles(fileList: string[]): Promise<any> {
        if (fileList.length > 0){
            return new Promise((resolve, reject) => {
                FileUtils.readFile(fileList[0])
                .then((command: any) => {
                    console.log('Running ' + fileList[0]);
                    
                    this.postgresUtils.execute(command)
                        .then(() => {
                            fileList.splice(0,1);
                            return this.runFiles(fileList);
                        })
                        .catch(() => {
                            reject();
                        });
                })
            });
        } else {
            console.log('### DONE ###');
            return Promise.resolve();
        }
    }

    private static sendDataBack(result: any, res: any) {
        res.send({data: result});
    }

    private static sendErrorBack(error: any, res: any) {
        res.send({error: error});
    }

    private declareRoutes() {
        this.app.get('/settings', (req: any, res: any) => {
            console.log('/settings');
            this.databaseManagement
            .execute('mgtf_get_settings')
            .then((data: any) => {
                res.send({error: null, data: data});
            }).catch((error) => {
                console.log(error);
                
                res.send({error: error});
            });
        });
        this.app.post('/settings/update', (req: any, res: any) => {
            console.log('/settings/update');
            const body:{
                name: string,
                value: string,
                id: number
            }[] = req.body;
            this.databaseManagement
            .execute('mgtf_update_settings', [JSON.stringify(body)])
            .then((data: any) => {
                res.send({error: null, data: data});
            }).catch((error) => {
                console.log(error);
                res.send({error: error});
            });
        });
        this.app.get('/databases', (req: any, res: any) => {
            console.log('/databases');
            if (this.repositories) {
                Promise.all(this.repositories
                    .filter(x => x.isDatabase)
                    .map(x => FileUtils.getFileList({
                        filter: /version\.json/,
                        startPath: '../repos/' + x.name,
                        foldersToIgnore: ['typescript']
                    })))
                    .then((data) => {
                        this.databases = data;
                        res.send({data: data});
                    }).catch((error) => {
                        res.send({error: error});
                    });
            } else {
                res.send({error: 'No repos yet. Please go to http://localhost:690/repositories'});
            }
        });
        this.app.get('/repositories', (req: any, res: any) => {
            console.log('/repositories');
            this.repositoryReader.getRepositoryList()
            .then(x => ManagementServer.sendDataBack(x, res))
            .catch(x => ManagementServer.sendErrorBack(x, res));
        });
        this.app.get('/repositories/refresh-all', (req: any, res: any) => {
            console.log('/repositories/refresh-all');
            this.repositoryReader.getRepositoryList()
            .then(x => ManagementServer.sendDataBack(x, res))
            .catch(x => ManagementServer.sendErrorBack(x, res));
        });

        this.app.get('/', function(req: any, res: any) {
            const links = [
                'http://localhost:690/repositories',
                'http://localhost:690/databases'
            ];
            res.send(links.map(x => `<a href="${x}">${x}</a>`).join('<br/>'));
        });
        this.app.post('/installation-script', (req: any, res: any) => {
            const body:{
                query: string,
                user?: string,
                password?: string,
                server?: string,
                port?: string,
                database? :string
            } = req.body;

            if (body.user && body.server && body.password && body.port && body.database) {
                this.postgresUtils.setConnectionString(`postgres://${body.user}:${body.password}@${body.server}:${body.port}/${body.database}`);
            }
            
            this.postgresUtils.execute(body.query)
                .then((result) => {
                    res.send({error: null, data: result});
                })
                .catch(result => {
                    res.send({error: result, data: null});
                });
        });

        this.io.on('connection', (client: any) => {
            console.log('Client connected...');
            this.attachSocket(client);
        });
    }

    private attachSocket(client: any) {
        this.client = client;
        this.client.on('run discovery', () => {
            console.log('run discovery');
            this.client.emit('run discovery complete', null);
        });
    }
}