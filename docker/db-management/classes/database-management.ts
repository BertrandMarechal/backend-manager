import { PostgresUtils } from "../utils/postgres.utils";
import { FileUtils } from "../utils/file.utils";
import { DatabaseInstallationProgress } from "../models/database-installation-progress.model";
import { promises } from "fs";

const originFolder = process.argv[2] ? '../../../' : '../repos/';

interface FolderStructureItem {
    folderName?: string,
    children?: FolderStructureItem[],
    fileName?: string,
    fileSource?: string,
}
interface ReplacementToDo {
    oldValue: string;
    newValue: string;
}
interface DatabaseSettingForInstallation {
    [repoName: string]: {
        [settingName: string]: string
    }
}
export class DatabaseManagement {
    postgresUtils: PostgresUtils;
    filesData: { [name: string]: string };
    scriptsToRunAndDatabase: { database: string, fileName: string }[];
    currentDatabaseStepId: number;
    currentScriptId: number;
    currentSettings: DatabaseSettingForInstallation;
    databaseInstallationProgress: DatabaseInstallationProgress[];
    databaseInstallationProgressCallback: (databases: DatabaseInstallationProgress[]) => void;

    constructor() {
        this.filesData = {};
        this.scriptsToRunAndDatabase = [];
        this.databaseInstallationProgress = [];
        this.currentSettings = {};
        this.currentScriptId = -1;
        this.currentDatabaseStepId = -1;
        this.databaseInstallationProgressCallback = (databases) => {
            console.log(databases);
        };
        this.postgresUtils = new PostgresUtils();
        this.postgresUtils.setConnectionString(process.argv[2] ? 'postgres://root:route@localhost:5432/postgres' : 'postgres://root:route@postgresdb:5432/postgres')
    }

    execute(functionName: string, data?: any[]): Promise<any> {
        return this.postgresUtils.executeFunction(functionName, data)
    }

    createDatabaseFolderStructure(repoName: string, dbAlias: string): Promise<any> {
        return new Promise((resolve, reject) => {
            FileUtils.readJsonFile(__dirname + '/../data/database-structure/folder-structure.json')
                .then((folderStructure: FolderStructureItem[]) => {
                    console.log(folderStructure);

                    for (let i = 0; i < folderStructure.length; i++) {
                        const element = folderStructure[i];
                        this.processFolderStructureItem(element, dbAlias, originFolder + repoName + '/');
                    }
                    resolve();
                })
                .catch(reject);
        });
    }

    private processFolderStructureItem(folderStructureItem: FolderStructureItem, dbAlias: string, currentPath: string) {
        if (folderStructureItem.folderName) {

            FileUtils.createFolderIfNotExistsSync(currentPath + folderStructureItem.folderName);
            if (folderStructureItem.children) {
                for (let i = 0; i < folderStructureItem.children.length; i++) {
                    const element = folderStructureItem.children[i];
                    this.processFolderStructureItem(element, dbAlias, currentPath + folderStructureItem.folderName + '/');
                }
            } else {
                FileUtils.writeFileSync(currentPath + 'placeholder_to_delete.txt', '');
            }
        } else if (folderStructureItem.fileName) {
            let source = '';
            if (folderStructureItem.fileSource) {
                source = this.filesData[folderStructureItem.fileSource];
                if (!source) {
                    source = FileUtils.readFileSync(__dirname + '/../data/database-structure/files/' + folderStructureItem.fileSource);
                    this.filesData[folderStructureItem.fileSource] = source;
                }
                source = source.replace(/\<db\>/gi, dbAlias);
            }
            const fileName = folderStructureItem.fileName.replace(/\<db\>/gi, dbAlias);
            FileUtils.writeFileSync(currentPath + fileName, source);
        }
    }

    createNewVersion(repoName: string): Promise<any> {
        return new Promise((resolve, reject) => {
            // check that the current folder exists or not in release and postgres
            const alreadyExists = FileUtils.checkIfFolderExists(originFolder + repoName + '/postgres/release/current') ||
                FileUtils.checkIfFolderExists(originFolder + repoName + '/postgres/current');
            if (alreadyExists) {
                reject('Current version already exists')
            } else {
                // create the version.json file
                // create the current folder in postgres
                FileUtils.createFolderIfNotExistsSync(originFolder + repoName + '/postgres/release/current');
                FileUtils.createFolderIfNotExistsSync(originFolder + repoName + '/postgres/release/current/scripts');
                FileUtils.createFolderIfNotExistsSync(originFolder + repoName + '/postgres/current');
                let source = this.filesData['version.json'];
                if (!source) {
                    source = FileUtils.readFileSync(__dirname + '/../data/database-structure/files/version.json');
                    this.filesData['version.json'] = source;
                }
                console.log(originFolder + repoName + '/postgres/release/current/version.json');
                FileUtils.writeFileSync(originFolder + repoName + '/postgres/release/current/version.json', source);
                resolve();
            }
        })
    }

    prepareUpdateDatabaseObject(params: { repoName: string, fileName: string, mode: string }): Promise<any> {
        return new Promise((resolve, reject) => {
            // get source file
            console.log('get source file');
            console.log(originFolder + params.repoName + '/postgres/' + params.fileName);
            FileUtils.readFile(originFolder + params.repoName + '/postgres/' + params.fileName)
                .then((source: string) => {
                    console.log(source);

                    const fileNameSplit = params.fileName.split('/');
                    const fileFileName = fileNameSplit[fileNameSplit.length - 1];
                    const objectName = fileFileName.split('.')[0];
                    const fileNamesToAddToVersionJson: string[] = [];

                    if (params.fileName.indexOf('/03-tables/') > -1) {
                        console.log('table');
                        if (params.mode === 'drop') {
                            fileNamesToAddToVersionJson.push(params.fileName.replace('/postgres/schema/', '/postgres/current/'));
                            console.log('drop');
                            source = 'DROP TABLE IF EXISTS ' + objectName + ';';
                        } else if (params.mode === 'update') {
                            console.log('update');
                            // create alter table script
                            const alter = 'ALTER TABLE IF EXISTS ' + objectName + ' add column DUMMY INTEGER;';
                            FileUtils.writeFileSync(originFolder + params.repoName + '/postgres/release/current/scripts/alter_' + objectName + '.sql', alter);
                            fileNamesToAddToVersionJson.push('..//postgres/release/current/scripts/alter_' + objectName + '.sql');
                        }
                    } else if (params.fileName.indexOf('/07-functions/') > -1) {
                        // if we talk about a function we arerunning the script anyway
                        fileNamesToAddToVersionJson.push(params.fileName.replace('/postgres/schema/', '/postgres/current/'));
                        console.log('function');
                        if (params.mode === 'drop') {
                            console.log('drop');
                            source = 'DROP FUNCTION IF EXISTS ' + objectName + DatabaseManagement.getFunctionParameters(source) + ';';
                        } else if (params.mode === 'update') {
                            console.log('update');
                            source = 'DROP FUNCTION IF EXISTS ' + objectName + DatabaseManagement.getFunctionParameters(source) + ';\r\n'
                                + source;
                        }
                    }
                    // copy to current
                    console.log('copy to current');
                    FileUtils.writeFileSync(originFolder + params.repoName + '/postgres/' + params.fileName.replace('/postgres/schema/', 'postgres/current/'), source);
                    // update version.json
                    console.log('update version.json');

                    FileUtils.readJsonFile(originFolder + params.repoName + '/postgres/release/current/version.json')
                        .then((data) => {
                            data[data.length - 1].fileList = [
                                ...data[data.length - 1].fileList,
                                ...fileNamesToAddToVersionJson.filter(x => {
                                    return data[data.length - 1].fileList.indexOf(x) === -1;
                                })
                            ];
                            FileUtils.writeFileSync(originFolder + params.repoName + '/postgres/release/current/version.json', JSON.stringify(data));
                            resolve();
                        })
                        .catch(reject);
                })
                .catch(reject);
        });
    }

    private static getFunctionParameters(command: string) {
        let types: string[] = [];
        command = command.replace('  ', ' ').replace(/\t/gi, ' ').replace(/\r\n/gi, ' ');
        const matches = command.match(/\((.*?)\)/mi);
        if (matches && matches[1]) {
            const match = matches[1];
            let types = [];
            if (match) {
                types = match.split(',').reduce((current, x) => {
                    return current.concat(x.split(' ').filter(Boolean).reduce((current: any, x: string, i: number) => {
                        if (i === 0) {
                            current = x;
                        } else if (i === 1 && !!x) {
                            current = x;
                        }
                        return current;
                    }, null));
                }, []);
            }

        } else {
            return '';
        }
        return '(' + types.join(',') + ')';
    }

    setVersionAsInstalled(params: { repoName: string, versionName: string }): Promise<any> {
        return new Promise((resolve, reject) => {
            // rename release/current as release/versionName
            console.log('rename release/current as release/versionName');
            FileUtils.renameFolder(
                originFolder + params.repoName + '/postgres/release/current',
                originFolder + params.repoName + '/postgres/release/' + params.versionName)
                .then(() => {
                    // get the files from current
                    console.log('get the files from current');
                    FileUtils.getFileList({
                        startPath: originFolder + params.repoName + '/postgres/current',
                        filter: /.sql/
                    })
                        .then((fileList: string[]) => {
                            // put them in a schema_changes folder under the current version
                            console.log('put them in a schema_changes folder under the current version');
                            for (let i = 0; i < fileList.length; i++) {
                                const fileName = fileList[i];
                                FileUtils.copyFileSync(
                                    fileName,
                                    fileName.replace('postgres/current', 'postgres/release/' + params.versionName + '/schema_changes')
                                );
                            }
                            // ovewrite the schema ones
                            console.log('ovewrite the schema ones');
                            for (let i = 0; i < fileList.length; i++) {
                                const fileName = fileList[i];
                                FileUtils.copyFileSync(
                                    fileName,
                                    fileName.replace('postgres/current', 'postgres/schema')
                                );
                            }
                            // update version.json
                            console.log('update version.json');
                            FileUtils.readJsonFile(originFolder + params.repoName + '/postgres/release/' + params.versionName + '/version.json')
                                .then((data) => {
                                    const updatedData = data.map((x: any) => {
                                        return {
                                            ...x,
                                            fileList: x.fileList.map((y: string) => y.replace('postgres/current', 'postgres/release/' + params.versionName + '/schema_changes'))
                                        }
                                    });
                                    FileUtils.writeFileSync(originFolder + params.repoName + '/postgres/release/' + params.versionName + '/version.json', JSON.stringify(updatedData));
                                    // delete the files
                                    console.log('delete the files');
                                    for (let i = 0; i < fileList.length; i++) {
                                        const fileName = fileList[i];
                                        FileUtils.deleteFileSync(
                                            fileName
                                        );
                                    }
                                    FileUtils.deleteFolderRecursiveSync(originFolder + params.repoName + '/postgres/current');
                                    resolve();
                                })
                                .catch(reject);
                        })
                        .catch(reject);
                })
                .catch(reject);

        });
    }

    getEnvironmentSettings(params: { repoName?: string, environment: string }): Promise<{ repoName: string, key: string, value: string }[]> {
        return new Promise((resolve, reject) => {
            this.postgresUtils.executeFunction('mgtf_get_database_settings', [params.repoName, params.environment])
                .then(resolve)
                .catch(reject);
        });
    }

    getInstallationTree(params: { repoName?: string, version?: string, user?: string, fileName?: string }) {
        return new Promise((resolve, reject) => {
            this.postgresUtils.executeFunction('mgtf_get_installation_tree', [params.repoName, params.version, params.user, params.fileName])
                .then(resolve)
                .catch(reject);
        });
    }

    installDatabases(
        databases: DatabaseInstallationProgress[],
        settings: { repoName: string, key: string, value: string }[],
        callback: (databases: DatabaseInstallationProgress[]) => void): Promise<any> {
        return new Promise((resolve, reject) => {
            this.processSettings(settings);
            this.currentScriptId = -1;
            this.currentDatabaseStepId = -1;
            this.databaseInstallationProgress = databases;
            this.databaseInstallationProgressCallback = callback;
            this.installDatabaseStepsOneByOne()
                .then(resolve)
                .catch(reject);
        })
    }

    private processSettings(settings: { repoName: string, key: string, value: string }[]) {
        this.currentSettings = settings.reduce((current: DatabaseSettingForInstallation, x) => {
            if (current[x.repoName]) {
                current[x.repoName][x.key]= x.value;
            } else {
                current[x.repoName] = {
                    [x.key]: x.value
                };
            }
            return current;
        }, {});
    }

    private installDatabaseStepsOneByOne():Promise<any> {
        this.currentDatabaseStepId++;
        return new Promise((resolve, reject) => {
            if (this.databaseInstallationProgress[this.currentDatabaseStepId]) {
                this.installDatabaseStep()
                    .then(() => {
                        this.installDatabaseStepsOneByOne()
                            .then(resolve)
                            .catch(reject);
                    })
                    .catch(reject);
            } else {
                resolve();
            }
        });
    }

    private installDatabaseStep(): Promise<any> {
        this.currentScriptId = -1;
        return this.runScriptsOneByOne();
    }

    private runScriptsOneByOne():Promise<any> {
        this.currentScriptId++;
        return new Promise((resolve, reject) => {
            if (this.databaseInstallationProgress[this.currentDatabaseStepId].files[this.currentScriptId]) {
                this.runScript()
                    .then(() => {
                        this.runScriptsOneByOne()
                            .then(resolve)
                            .catch(reject);
                    })
                    .catch(reject);
            } else {
                resolve();
            }
        });
    }

    private runScript(): Promise<any> {
        this.currentScriptId = -1;
        return new Promise((resolve, reject) => {
            FileUtils.readFile(originFolder +
                this.databaseInstallationProgress[this.currentDatabaseStepId].repoName + '/release/' +
                this.databaseInstallationProgress[this.currentDatabaseStepId].files[this.currentScriptId].fileName)
                .then((command: string) => {
                    let toReplace: ReplacementToDo | null = this.getReplacementToDo(command, this.databaseInstallationProgress[this.currentDatabaseStepId].repoName);
                    while (toReplace) {
                        command = command.replace(toReplace.oldValue,toReplace.newValue);
                        toReplace = this.getReplacementToDo(command, this.databaseInstallationProgress[this.currentDatabaseStepId].repoName);
                    }
                    return this.postgresUtils.execute(command);
                })
                .catch(reject)
            
        });
    }

    private getReplacementToDo(command: string, repoName: string): {oldValue: string, newValue: string} | null  {
        let replacementToDo : {oldValue: string, newValue: string} | null = null;
        let settingsToReplace = Object.keys(this.currentSettings[repoName]);
        for (let i = 0; i < settingsToReplace.length && !replacementToDo; i++) {
            const element = settingsToReplace[i];
            if (command.indexOf(element) > -1) {
                replacementToDo = {oldValue: element, newValue: this.currentSettings[repoName][element]};
            }
        }
        return replacementToDo
    }
}