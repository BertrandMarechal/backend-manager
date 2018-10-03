import express from 'express';
import * as http from 'http';
import * as bodyParser from 'body-parser';
import {spawn} from 'child_process';
import IO from "socket.io";
import { FileUtils } from '../../utils/file.utils';
import { DatabaseManagement } from '../../common/classes/database-management';
import { RepositoryReader } from './repository-reader';
import { Setting } from '../../common/models/settings.model';
import { DatabaseInstallationProgress } from '../../common/models/database-installation-progress.model';

export class ManagementServer {
    private app: any;
    private server: any;
    private io: any;
    private client: any;
    private databaseManagement: DatabaseManagement;
    private repositoryReader: RepositoryReader;

    constructor() {
        this.databaseManagement = new DatabaseManagement();
        this.repositoryReader = new RepositoryReader(this.databaseManagement);
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
        this.app.use(bodyParser.json({ limit: '50mb' }));       // to support JSON-encoded bodies

        this.declareRoutes();
        if (process.argv[2]) {
            this.runDatabaseInitializationSctipt()
                .then(() => {
                    this.server.listen(process.argv[2] ? 690 : 8080, (error: any) => {
                        console.log('listening');
                    });
                })
                .catch((error) => {
                    console.log(error);

                });
        } else {
            this.server.listen(process.argv[2] ? 690 : 8080, (error: any) => {
                console.log('listening');
            });
        }

    }

    private runDatabaseInitializationSctipt(): Promise<any> {
        return Promise.resolve();
        // console.log('This step is made to run the SQL scripts on starting the ser on local use.');
        // console.log('WAIT FOR IT TO END before doing anything.');
        // console.log('REMOVE it on real use case.');
        // console.log('### STARTING ###');
        // return new Promise((resolve, reject) => {
        //     FileUtils.getFileList({
        //         startPath: '../postgres/scripts',
        //         filter: /\.sql/
        //     })
        //         .then((fileList) => {
        //             console.log(fileList.length + ' files to run');
        //             this.runFiles(fileList)
        //                 .then(resolve)
        //                 .catch(reject);
        //         });
        // });
    }

    private runFiles(fileList: string[]): Promise<any> {
        if (fileList.length > 0) {
            return new Promise((resolve, reject) => {
                FileUtils.readFile(fileList[0])
                    .then((command: any) => {
                        console.log('Running ' + fileList[0]);
                        this.databaseManagement.run(command)
                            .then(() => {
                                fileList.splice(0, 1);
                                return this.runFiles(fileList).then(resolve).catch(reject);
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
        res.send({ data: result });
    }

    private static sendErrorBack(error: any, res: any) {
        res.send({ error: error });
    }

    private declareRoutes() {
        this.app.get('/settings', (req: any, res: any) => {
            console.log('/settings');
            this.databaseManagement.getSettings()
                .then((settings: Setting[]) => {
                    res.send({ error: null, data: settings });
                }).catch((error) => {
                    console.log(error);
                    res.send({ error: error });
                });
        });
        this.app.post('/settings/update', (req: any, res: any) => {
            console.log('/settings/update');
            const body: Setting[] = req.body;
            this.databaseManagement
                .execute('mgtf_update_settings', [JSON.stringify(body)])
                .then((settings: Setting[]) => {
                    res.send({ error: null, data: settings });
                }).catch((error) => {
                    console.log(error);
                    res.send({ error: error });
                });
        });
        this.app.post('/database/setting/update', (req: any, res: any) => {
            console.log('/database/setting/update');
            const body: { settingName: string, settingValue: string, repoName: string, environment: string } = req.body;
            this.databaseManagement
                .execute('mgtf_set_database_environment_setting', [body.repoName, body.environment, body.settingName, body.settingValue])
                .then(() => {
                    res.send({ error: null, data: body });
                }).catch((error) => {
                    console.log(error);
                    res.send({ error: error });
                });
        });
        this.app.post('/serverless/setting/update', (req: any, res: any) => {
            console.log('/serverless/setting/update');
            const body: { settingName: string, settingValue: string, serviceName: string, environment: string } = req.body;
            this.databaseManagement
                .execute('mgtf_set_serverless_environment_setting', [body.serviceName, body.environment, body.settingName, body.settingValue])
                .then(() => {
                    res.send({ error: null, data: body });
                }).catch((error) => {
                    console.log(error);
                    res.send({ error: error });
                });
        });
        
        this.app.get('/databases/:repo/init/:dbalias', (req: any, res: any) => {
            console.log('/databases/' + req.params.repo + '/init');
            this.databaseManagement.createDatabaseFolderStructure(req.params.repo, req.params.dbalias)
                .then((x: any) => ManagementServer.sendDataBack(x, res))
                .catch((x: any) => ManagementServer.sendErrorBack(x, res));
        });
        this.app.get('/databases/:repo/watch', (req: any, res: any) => {
            console.log('/databases/' + req.params.repo + '/watch');
            // we want to launch the database watcher if not already set up
            this.startWatchServer(req.params.repo, 'local_nrd');
            res.send('OK');
        });

        this.app.get('/environments', (req: any, res: any) => {
            console.log('/environments');
            this.databaseManagement.execute('mgtf_get_environments')
                .then(x => ManagementServer.sendDataBack(x, res))
                .catch(x => ManagementServer.sendErrorBack(x, res));
        });
        this.app.get('/repositories', (req: any, res: any) => {
            console.log('/repositories');
            this.repositoryReader.geRepositoryData()
                .then(x => ManagementServer.sendDataBack(x, res))
                .catch(x => ManagementServer.sendErrorBack(x, res));
        });
        this.app.get('/repositories/refresh-all', (req: any, res: any) => {
            console.log('/repositories/refresh-all');
            this.repositoryReader.getRepositoryList()
                .then(x => ManagementServer.sendDataBack(x, res))
                .catch(x => ManagementServer.sendErrorBack(x, res));
        });

        this.app.get('/', function (req: any, res: any) {
            const links = [
                'http://localhost:690/repositories',
                'http://localhost:690/databases'
            ];
            res.send(links.map(x => `<a href="${x}">${x}</a>`).join('<br/>'));
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
            this.client.emit('run discovery progress', { completion: 1, stepName: 'Initiated' });
            this.databaseManagement
                .execute('mgtf_get_settings')
                .then((settings: Setting[]) => {
                    const promises = [
                        { promise: this.repositoryReader.getRepositoryList.bind(this.repositoryReader), message: 'Get Repository List', completion: 20 },
                        { promise: this.repositoryReader.getDatabasesVersionFiles.bind(this.repositoryReader), message: 'Get Database Version Files', completion: 40 },
                        { promise: this.repositoryReader.getDatabaseParametersFromFiles.bind(this.repositoryReader), message: 'Get Database Parameters From Files', completion: 60 },
                        { promise: this.repositoryReader.geMiddleTierRepositoriesServerlessFiles.bind(this.repositoryReader), message: 'Get MiddleTier Serverless Files', completion: 80 }
                    ];

                    this.repositoryReader.setSettings(settings);

                    console.log('runPromises');
                    this.runPromises(promises, (params: { completion: number, stepName: string }) => {
                        this.client.emit('run discovery progress', params);
                    }).then((data: any) => {
                        this.client.emit('run discovery progress', { completion: 100, stepName: 'Done' });
                        this.repositoryReader.geRepositoryData()
                            .then((data: any) => {
                                this.client.emit('run discovery complete', data);
                            })
                            .catch((error) => {
                                this.client.emit('run discovery failed', error);
                            })
                    }).catch((error) => {
                        console.log(error);
                        this.client.emit('run discovery failed', error);
                    });
                }).catch((error) => {
                    this.client.emit('run discovery failed', error);
                });
        });
        this.client.on('initialize database', (params: { repoName: string, dbAlias: string }) => {
            console.log('initialize database');
            this.databaseManagement.createDatabaseFolderStructure(params.repoName, params.dbAlias)
                .then((x: any) => {
                    this.repositoryReader.getRepoDatabaseFiles(params.repoName)
                        .then(() => {
                            this.repositoryReader.geRepositoryData()
                                .then((data: any) => {
                                    this.client.emit('run discovery complete', data);
                                })
                                .catch((error) => {
                                    this.client.emit('initialize database failed', error);
                                })
                        })
                        .catch((error) => {
                            this.client.emit('initialize database failed', error);
                        })
                })
                .catch((error) => {
                    this.client.emit('initialize database failed', error);
                });

        });
        this.client.on('install database', (params: { repoName?: string, version?: string, user?: string, fileName?: string, environment: string }) => {
            console.log('install database');
            this.databaseManagement.prepareInstallationAndInstall(params,(databaseProgress: DatabaseInstallationProgress[]) => {                                        
                this.client.emit('install database progress', databaseProgress);
            })
            .then((data: any) => {
                console.log('installed');
                this.client.emit('install database complete', data);
            })
            .catch((error: any) => {
                console.log(error);
                this.client.emit('install database failed', error);
            });

        });
        this.client.on('create database version', (repoName: string) => {
            console.log('create database version');
            this.databaseManagement.createNewVersion(repoName)
                .then((x: any) => {
                    this.repositoryReader.getRepoDatabaseFiles(repoName)
                        .then(() => {
                            this.repositoryReader.geRepositoryData()
                                .then((data: any) => {
                                    this.client.emit('run discovery complete', data);
                                })
                                .catch((error) => {
                                    this.client.emit('create database version failed', error);
                                })
                        })
                        .catch((error) => {
                            this.client.emit('create database version failed', error);
                        })
                })
                .catch((error) => {
                    this.client.emit('create database version failed', error);
                });
        });
        this.client.on('prepare update object', (params: { repoName: string, fileName: string, mode: string }) => {
            console.log('prepare update object');
            this.databaseManagement.prepareUpdateDatabaseObject(params)
                .then((x: any) => {
                    this.repositoryReader.getRepoDatabaseFiles(params.repoName)
                        .then(() => {
                            this.repositoryReader.geRepositoryData()
                                .then((data: any) => {
                                    this.client.emit('run discovery complete', data);
                                })
                                .catch((error) => {
                                    this.client.emit('prepare update object failed', error);
                                })
                        })
                        .catch((error) => {
                            this.client.emit('prepare update object failed', error);
                        })
                })
                .catch((error) => {
                    this.client.emit('prepare update object failed', error);
                });
        });
        this.client.on('set version as installed', (params: { repoName: string, versionName: string }) => {
            console.log('set version as installed');
            this.databaseManagement.setVersionAsInstalled(params)
                .then((x: any) => {
                    this.repositoryReader.getRepoDatabaseFiles(params.repoName)
                        .then(() => {
                            this.repositoryReader.geRepositoryData()
                                .then((data: any) => {
                                    this.client.emit('run discovery complete', data);
                                })
                                .catch((error) => {
                                    this.client.emit('set version as installed failed', error);
                                })
                        })
                        .catch((error) => {
                            this.client.emit('set version as installed failed', error);
                        })
                })
                .catch((error) => {
                    this.client.emit('set version as installed failed', error);
                });
        });
    }

    private startWatchServer(repoName: string, dbAlias: string) {
        // update nodemon-watcher.json
        // start the child process
        const watcherServer = spawn('nodemon.cmd', ['--config', 'local-nodemon-db-watcher', '-L'], {
            stdio: ['pipe', 'pipe', 'pipe'],
        });

        watcherServer.stdout.on('data', (data) => {
            console.log(`stdout: ${data}`);
        });

        // watcherServer.stderr.on('data', (data) => {
        //     console.log(`stderr: ${data}`);
        // });

        watcherServer.on('close', (code) => {
            console.log(`child process exited with code ${code}`);
        });
    }

    private runPromises(promises: { promise: () => Promise<any>, message: string, completion: number }[], callback: (params: { completion: number, stepName: string }) => void) {

        return new Promise((resolve, reject) => {
            if (promises.length > 0) {
                console.log(promises[0].message + ' todo');
                promises[0].promise()
                    .then(() => {
                        console.log(promises[0].message + ' done');
                        callback({ stepName: promises[0].message, completion: promises[0].completion });
                        promises.splice(0, 1);
                        this.runPromises(promises, callback)
                            .then(resolve)
                            .catch(reject);
                    })
                    .catch((error) => {
                        console.log(error);
                        reject(error);
                    });
            } else {
                resolve();
            }
        });
    }
}