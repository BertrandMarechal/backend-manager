import { DatabaseManagement } from "../../common/classes/database-management";
import { FileUtils } from "../../utils/file.utils";
import { Repository } from "../models/repository.model";
import { Setting } from "../../common/models/settings.model";
import * as YAML from 'yamljs';
import { DatabaseVersionFileData, DatabaseVersionInformation } from "../../common/models/database-version-file-data.model";
import * as path from "path";
import { ServerlessFile } from "../models/serverless-file.model";

const originFolder = process.argv[2] ? '../../../' : '../repos/';
const postgresDatabaseToUse = process.argv[2] ? 'localhost' : 'postgresdb';

export class RepositoryReader {
    private databaseManagement: DatabaseManagement;
    private settings: Setting[];
    private databaseExtension: string;
    private variablesForRepo: string[];
    private variableRegex = new RegExp(/\<(\w+)\>/gi);
    private concurentFilesRead = 5;
    private connectionString = `postgres://root:route@${postgresDatabaseToUse}:5432/postgres`;

    constructor(databaseManagement: DatabaseManagement) {
        this.databaseManagement = databaseManagement;
        this.settings = [];
        this.variablesForRepo = [];
        this.databaseExtension = 'database';
    }

    private static processFileName(fileName: string) {
        let newFileName = fileName
            .replace('//', '/')
            .replace(originFolder, '');
        return newFileName;
    }

    private static ymlToJson(data: string) {
        return YAML.parse(data.replace(/\t/g, '  ').replace(/\r\n\r\n/g, '\r\n').replace(/\r\n\r\n/g, '\r\n').replace(/\n$/, "").trim());
    }

    setSettings(settings: Setting[]) {
        this.settings = settings;
        if (this.settings.find(x => x.name === 'database extension')) {
            this.databaseExtension = (<Setting>this.settings.find(x => x.name === 'database extension')).value;
        }
    }

    getRepositoryList(): Promise<any> {
        return new Promise((resolve, reject) => {
            this.databaseManagement
                .setConnectionString(this.connectionString)
                .execute('mgtf_get_repositories')
                .then((repositories: Repository[]) => {
                    if (!repositories || repositories.length === 0) {
                        FileUtils.getFolderList({
                            startPath: originFolder
                        }).then((fileList: string[]) => {
                            fileList = fileList
                                .map(RepositoryReader.processFileName);

                            this.databaseManagement
                                .setConnectionString(this.connectionString)
                                .execute('mgtf_update_repo_folders', [fileList])
                                .then((newRepositories: any) => {
                                    resolve(newRepositories);
                                }).catch(reject);
                        }).catch(reject);
                    } else {
                        resolve(repositories);
                    }
                })
                .catch(reject);
        });
    }
    getDatabasesVersionFiles(): Promise<any> {
        return new Promise((resolve, reject) => {
            this.databaseManagement
                .setConnectionString(this.connectionString)
                .execute('mgtf_get_repositories')
                .then((repositories: Repository[]) => {
                    // get the repositories that are SQL
                    const sqlFolders = repositories.filter(x => x.isDatabase);
                    if (sqlFolders.length === 0) {
                        this.databaseManagement
                            .setConnectionString(this.connectionString)
                            .execute('mgtf_update_database_version_files')
                            .then((data: any) => {
                                resolve(data);
                            }).catch(reject);
                    } else {
                        this.getReposDatabaseFiles(sqlFolders.map(x => x.name))
                            .then(resolve)
                            .catch(reject);
                    }
                })
                .catch(reject);
        });
    }

    private getReposDatabaseFiles(repoNames: string[]): Promise<any> {
        return new Promise((resolve, reject) => {
            if (repoNames.length > 0) {
                this.getRepoDatabaseFiles(repoNames.splice(0, 1)[0])
                    .then(() => {
                        this.getReposDatabaseFiles(repoNames)
                            .then(resolve)
                            .catch(reject);
                    })
                    .catch(reject);
            } else {
                resolve();
            }
        });
    }

    getRepoDatabaseFiles(repoName: string): Promise<any> {
        return new Promise((resolve, reject) => {
            this.getDatabaseVersionFiles(repoName)
                .then((fileList: string[]) => {
                    Promise.all(fileList.map(x => this.readDatabaseVersionFile(x)))
                        .then((filesData: DatabaseVersionFileData[][]) => {
                            const filesDataToSave = filesData.reduce((current, x) => {
                                return current.concat(x);
                            }, []);
                            this.databaseManagement
                                .setConnectionString(this.connectionString)
                                .execute('mgtf_update_database_version_files', [repoName, JSON.stringify(filesDataToSave)])
                                .then(resolve)
                                .catch(reject);
                        })
                        .catch(reject);

                })
                .catch(reject);
        });
    }

    private getDatabaseVersionFiles(repoName: string): Promise<string[]> {
        return new Promise((resolve, reject) => {
            FileUtils.getFileList({
                startPath: originFolder + repoName,
                filter: /version\.json/
            }).then((fileList: string[]) => {
                resolve(fileList);
            }).catch(reject);
        });
    }

    private readDatabaseVersionFile(fileName: string): Promise<DatabaseVersionFileData[]> {
        return new Promise((resolve, reject) => {
            FileUtils.readJsonFile(fileName)
                .then((data: any) => {
                    resolve(data.map((x: DatabaseVersionInformation) => {
                        return { fileName: RepositoryReader.processFileName(fileName), version: x };
                    }))
                })
                .catch(reject);
        });
    }

    getDatabaseParametersFromFiles(): Promise<any> {
        return new Promise((resolve, reject) => {
            this.databaseManagement
                .setConnectionString(this.connectionString)
                .execute('mgtf_get_repositories')
                .then((repositories: Repository[]) => {
                    // get the repositories that are SQL
                    const sqlFolders = repositories.filter(x => x.isDatabase);
                    this.getAllReposDatabaseParametersFromFiles(sqlFolders.map(x => x.name))
                        .then(resolve)
                        .catch(reject);
                })
                .catch(reject);
        });
    }

    private getAllReposDatabaseParametersFromFiles(repoNames: string[]): Promise<any> {
        return new Promise((resolve, reject) => {
            if (repoNames.length > 0) {
                this.getRepoDatabaseParametersFromFiles(repoNames.splice(0, 1)[0])
                    .then(() => {
                        this.getAllReposDatabaseParametersFromFiles(repoNames)
                            .then(resolve)
                            .catch(reject);
                    })
                    .catch(reject);
            } else {
                resolve();
            }
        });
    }

    private getRepoDatabaseParametersFromFiles(repoName: string): Promise<any> {
        return new Promise((resolve, reject) => {
            this.databaseManagement
                .setConnectionString(this.connectionString)
                .execute('mgtf_get_database_version_files', [repoName])
                .then((versionsFiles: { path: string }[]) => {
                    this.variablesForRepo = [];
                    this.readDatabaseFilesForVariables(versionsFiles.map(x => x.path))
                        .then(() => {
                            this.databaseManagement
                                .setConnectionString(this.connectionString)
                                .execute('mgtf_save_database_repo_variables', [repoName, JSON.stringify(this.variablesForRepo)])
                                .then(resolve)
                                .catch(reject);
                            resolve();
                        })
                        .catch(reject);
                })
                .catch(reject);
        })
    }

    private readDatabaseFilesForVariables(fileList: string[]): Promise<any> {
        return new Promise((resolve, reject) => {
            if (fileList.length) {
                const fileName = path.resolve(originFolder, fileList[0]);
                FileUtils.readFile(fileName)
                    .then((fileContents: string) => {
                        const variables = fileContents.match(this.variableRegex);
                        if (variables && variables.length > 0) {
                            this.variablesForRepo = variables.reduce((current: any, x) => {
                                const existingItem = current
                                    .find((y: string) => y === x)
                                if (!existingItem) {
                                    this.variablesForRepo.push(x);
                                }
                                return current;
                            }, this.variablesForRepo);
                        }
                        fileList.splice(0, 1);
                        this.readDatabaseFilesForVariables(fileList)
                            .then(resolve)
                            .catch(reject);
                    })
                    .catch(reject);
            } else {
                resolve();
            }
        });
    }

    geMiddleTierRepositoriesServerlessFiles(): Promise<any> {
        return new Promise((resolve, reject) => {
            this.databaseManagement
                .setConnectionString(this.connectionString)
                .execute('mgtf_get_repositories')
                .then((repositories: Repository[]) => {
                    // get the repositories that are SQL
                    const middleTierFolders = repositories.filter(x => x.isMiddleTier);
                    if (middleTierFolders.length === 0) {
                        this.databaseManagement
                            .setConnectionString(this.connectionString)
                            .execute('mgtf_update_middle_tier_files')
                            .then((data: any) => {
                                resolve(data);
                            }).catch(reject);
                    } else {
                        this.readAllRepoMiddleTierFiles(middleTierFolders.map(x => x.name))
                            .then(resolve)
                            .catch(reject);
                    }
                })
                .catch(reject);
        });
    }

    private readAllRepoMiddleTierFiles(repoNames: string[]): Promise<any> {
        return new Promise((resolve, reject) => {
            if (repoNames.length > 0) {
                this.processMiddleTierFiles(repoNames.splice(0, 1)[0])
                    .then(() => {
                        this.readAllRepoMiddleTierFiles(repoNames)
                            .then(resolve)
                            .catch(reject);
                    })
                    .catch(reject);
            } else {
                resolve();
            }
        });
    }

    private processMiddleTierFiles(repoName: string): Promise<{ repoName: string, fileList: string[] }> {
        return new Promise((resolve, reject) => {
            Promise.all(
                [
                    FileUtils.getFileList({
                        startPath: originFolder + repoName,
                        filter: /serverless\.yml/
                    }),
                    FileUtils.getFileList({
                        startPath: originFolder + repoName,
                        filter: /variables\.yml/
                    })
                ]
            )
                .then((fileLists: string[][]) => {
                    const files = [
                        ...fileLists[0].map(x => {
                            return {
                                type: 'serverless',
                                location: RepositoryReader.processFileName(x),
                                parentFolder: RepositoryReader.processFileName(x).replace('/serverless.yml', '')
                            }
                        }),
                        ...fileLists[1].map(x => {
                            return {
                                type: 'variables',
                                location: RepositoryReader.processFileName(x),
                                parentFolder: RepositoryReader.processFileName(x).replace('/variables.yml', '')
                            }
                        })
                    ];
                    const groupedFiles = files.reduce((current: { parentFolder: string, hasVariables: boolean }[], x) => {
                        if (x.type === 'serverless') {
                            current.push({ parentFolder: x.parentFolder, hasVariables: false });
                        } else if (x.type === 'variables') {
                            const serverlessIndex = current.findIndex(y => y.parentFolder === x.parentFolder);
                            if (serverlessIndex > -1) {
                                current[serverlessIndex].hasVariables = true;
                            }
                        }
                        return current;
                    }, []);
                    this.readAllMiddleTierFiles(groupedFiles, repoName)
                        .then(resolve)
                        .catch(reject);
                })
                .catch(reject);
        });
    }

    private readAllMiddleTierFiles(fileList: { parentFolder: string, hasVariables: boolean }[], repoName: string): Promise<any> {
        return new Promise((resolve, reject) => {
            if (fileList.length > 0) {
                this.readMiddleTierFiles(fileList.splice(0, 1)[0], repoName)
                    .then(() => {
                        this.readAllMiddleTierFiles(fileList, repoName)
                            .then(resolve)
                            .catch(reject);
                    })
                    .catch(reject);
            } else {
                resolve();
            }
        });
        return Promise.resolve();
    }

    private readMiddleTierFiles(filesData: { parentFolder: string, hasVariables: boolean }, repoName: string): Promise<any> {
        return new Promise((resolve, reject) => {
            const promises = [FileUtils.readFile(originFolder + filesData.parentFolder + '/serverless.yml')];
            if (filesData.hasVariables) {
                promises.push(FileUtils.readFile(originFolder + filesData.parentFolder + '/variables.yml'));
            }
            Promise.all(promises)
                .then((filesStrings: string[]) => {
                    const serverlessFile: ServerlessFile = new ServerlessFile(RepositoryReader.ymlToJson(filesStrings[0]));
                    let variables: { key: string, value: string }[] = [];
                    if (filesData.hasVariables) {
                        const variablesObject: { [name: string]: string } = RepositoryReader.ymlToJson(filesStrings[1]);
                        variables = Object.keys(variablesObject).map(x => {
                            return {
                                key: x,
                                value: variablesObject[x]
                            };
                        })
                    }

                    this.databaseManagement
                        .setConnectionString(this.connectionString)
                        .execute('mgtf_update_middle_tier_files', [repoName, filesData.parentFolder, JSON.stringify(serverlessFile), JSON.stringify(variables)])
                        .then(resolve).catch(reject);
                })
                .catch(reject);
        });
    }

    geRepositoryData(): Promise<any> {
        return new Promise((resolve, reject) => {
            this.databaseManagement
                .setConnectionString(this.connectionString)
                .execute('mgtf_get_repositories_data')
                .then(resolve).catch(reject);
        });
    }
}