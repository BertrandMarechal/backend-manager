import express from 'express';
import * as http from 'http';
import * as bodyParser from 'body-parser';
import * as path from 'path';
import {PostgresUtils} from '../utils/postgres.utils';
import { FileUtils } from '../utils/file.utils';
import { DatabaseManagement } from './database-management';


export class DatabaseManagementServer {
    private app: any;
    private server: any;
    private httpServer: any;
    private postgresUtils: PostgresUtils;
    private databaseManagement: DatabaseManagement;
    private repositories?: {name: string, isDatabase: boolean, isMiddleTier: boolean}[];
    private databases?: any;

    constructor() {
        this.postgresUtils = new PostgresUtils();
        this.databaseManagement = new DatabaseManagement();
        this.postgresUtils.setConnectionString('postgres://root:route@postgresdb:5432/postgres');
        // this.postgresUtils.setConnectionString('postgres://app_user_cad:app_user@localhost:5432/local_cad');
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
        this.app.use( bodyParser.json({limit: '50mb'}) );       // to support JSON-encoded bodies
        
        this.declareRoutes();

        this.server.listen(8080, (error: any) => {
            console.log('listening');
        });
    }

    private declareRoutes() {
        this.app.get('/databases', (req: any, res: any) => {
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
            if (req.query.refresh || !this.repositories) {
                FileUtils.getFolderList({
                    startPath: '../repos/'
                }).then((fileList: string[]) => {
                    this.databaseManagement
                        .execute('mgtf_update_repo_folders', [fileList])
                        .then((data: any) => {
                            this.repositories = data;
                            res.send({error: null, data: data});
                        }).catch((error) => {
                            console.log(error);
                            
                            res.send({error: error});
                        });
                }).catch((error) => {
                    res.send({error: error});
                });
            } else {
                this.databaseManagement
                    .execute('mgtf_get_repositories')
                    .then((data: any) => {
                        this.repositories = data;
                        res.send({error: null, data: data});
                    }).catch((error) => {
                        console.log(error);
                        
                        res.send({error: error});
                    });
            }
        });

        this.app.get('/', function(req: any, res: any) {
            const links = [
                'http://localhost:690/repositories',
                'http://localhost:690/databases'
            ];
            res.send(links.map(x => `<a href="${x}">${x}</a>`).join('<br/>'));
        });
    }
}