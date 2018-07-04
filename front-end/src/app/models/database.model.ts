export type Environments = 'local' | 'dev' | 'demo' | 'prod';

export interface RepositoryFile {
    name: string;
    databases: DatabaseFile[];
    isDatabase: boolean;
    middleTiers: MiddleTierFile[];
    isMiddleTier: boolean;
    parameters: {
        local?: RepositoryParameter[];
        dev?: RepositoryParameter[];
        demo?: RepositoryParameter[];
        prod?: RepositoryParameter[];
    };
}
interface IDatabaseInstallationProgress {
    repoName: string;
    version: string;
    user: string;
    installing: boolean;
    files: {
        fileName: string;
        done: boolean;
    }[];
}
export class DatabaseInstallationProgress implements IDatabaseInstallationProgress {
    repoName: string;
    version: string;
    user: string;
    installing: boolean;
    files: {
        fileName: string;
        done: boolean;
    }[];

    progress?: number;

    constructor(params?: IDatabaseInstallationProgress) {
        this.progress = 0;
        if (params) {
            for (const key in params) {
                if (params.hasOwnProperty(key)) {
                    this[key] = params[key];
                    if (key === 'files') {
                        this.progress = params.files.reduce((current, x) => {
                            current = {
                                ...current,
                                totalFiles: current.totalFiles + 1,
                                totalFilesDone: current.totalFiles + (x.done ? 1 : 0)
                            };
                            current.progress = current.totalFiles > 0 ? (current.totalFilesDone / current.totalFiles) : 0;
                            current.progress = Math.max((params.installing ? 1 : 0),
                                Math.floor(current.progress * 100));
                            return current;
                        }, {totalFiles: 0, totalFilesDone: 0, progress: 0 }).progress;
                    }
                }
            }
        }
    }
}

export interface MiddleTierFile {
    id: number;
    fileName: string;
    serviceName: string;
    functions: LambdaFunction[];
    parameters: MiddleTierFileParameter[];
}
export interface MiddleTierFileParameter {
    key: string;
    value: string;
    id: number;
}
export interface LambdaFunction {
    name: string;
    handler: string;
    handlerFunctionName: string;
    events: any[];
}
export interface RepositoryParameter {
    name: string;
    id: number;
    value: string;
}
export interface DatabaseFile {
    id: number;
    filePath: string;
    version: string;
    databases: DatabaseFileStep[];
}
export interface DatabaseFileStep {
    id: number;
    version: string;
    databaseToUse: string;
    databaseFiles: DatabaseFileStepFile[];
}

export interface DatabaseFileStepFile {
    id: number;
    filePath: string;
    position: number;
}

export class DatabaseInformation {
    hasCurrentFolder: boolean;
    canCreateNewVersion: boolean;
    functionFileList: string[];
    tableFileList: string[];

    constructor() { }

    private getDatabaseFileLists(database: RepositoryFile): void {
        if (database) {
            let fileList = database.databases.reduce((currentX, x) => {
                return currentX.concat(x.databases.reduce((currentY, y) => {
                    return currentY.concat(y.databaseFiles.map(z => z.filePath));
                }, []));
            }, []);

            // filter the files that are in current already
            fileList = fileList.filter(x => {
                if (x.indexOf('postgres/schema/') > -1) {
                    const subName = x.split('postgres/schema/')[1];
                    return fileList.filter((y: string) => y.indexOf('/postgres/current/' + subName) > -1).length === 0;
                } else if (x.indexOf('postgres/current/') > -1) {
                    const subName = x.split('postgres/current/')[1];
                    return fileList.filter((y: string) => y.indexOf('/postgres/schema/' + subName) > -1).length === 0;
                }
                return true;
            });
            this.functionFileList = fileList.filter(x => x.indexOf('07-functions') > -1);
            this.tableFileList = fileList.filter(x => x.indexOf('03-tables') > -1);
        } else {
            this.functionFileList = [];
            this.tableFileList = [];
        }
    }

    processDatabaseData(database: RepositoryFile) {
        if (database) {
            this.hasCurrentFolder = database.databases &&
                database.databases.filter(x => x.version === 'current').length > 0;
            this.canCreateNewVersion = database.databases &&
                database.databases.length > 0 &&
                database.databases.filter(x => x.version === 'current').length === 0;
        } else {
            this.hasCurrentFolder = false;
            this.canCreateNewVersion = false;
        }
        this.getDatabaseFileLists(database);
        return this;
    }
}