import { PostgresUtils } from "../utils/postgres.utils";
import { FileUtils } from "../utils/file.utils";

const originFolder = process.argv[2] ? '../../../' : '../repos/';

interface FolderStructureItem {
    folderName?: string,
    children?: FolderStructureItem[],
    fileName?: string,
    fileSource?: string,
}
export class DatabaseManagement {
    postgresUtils: PostgresUtils;
    filesData: { [name: string]: string };

    constructor() {
        this.filesData = {};
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
                            console.log('drop');
                            source = 'DROP TABLE IF EXISTS ' + objectName + ';';
                        } else {
                            console.log('update');
                            // create alter table script
                            const alter = 'ALTER TABLE IF EXISTS ' + objectName + ' add column DUMMY INTEGER;';
                            FileUtils.writeFileSync(originFolder + params.repoName + '/postgres/release/current/scripts/alter_' + objectName + '.sql', alter);
                            fileNamesToAddToVersionJson.push('..//postgres/release/current/scripts/alter_' + objectName + '.sql');
                        }
                    } else if (params.fileName.indexOf('/07-functions/') > -1) {
                        console.log('function');
                        if (params.mode === 'drop') {
                            console.log('drop');
                            source = 'DROP FUNCTION IF EXISTS ' + objectName + DatabaseManagement.getFunctionParameters(source) + ';';
                        } else {
                            console.log('update');
                            source = 'DROP FUNCTION IF EXISTS ' + objectName + DatabaseManagement.getFunctionParameters(source) + ';\r\n'
                                + source;
                        }
                    }
                    // copy to current
                    console.log('copy to current');
                    FileUtils.writeFileSync(originFolder + params.repoName + '/postgres/' + params.fileName.replace('/postgres/schema/', 'postgres/current/'), source);
                    fileNamesToAddToVersionJson.push(params.fileName.replace('/postgres/schema/', '/postgres/current/'));
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
}