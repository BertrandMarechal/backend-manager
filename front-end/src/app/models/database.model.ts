export type Environments = 'local' | 'dev' | 'demo' | 'prod';

export interface RepositoryFile {
    name: string;
    databases: DatabaseFile[];
    isDatabase: boolean;
    middleTiers: MiddleTierFile[];
    isMiddleTier: boolean;
    parameters: RepositoryParameter[];
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
    environments: {
        local?: string;
        dev?: string;
        demo?: string;
        prod?: string;
    };
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
    databaseUserToUse: string;
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

    constructor() {}

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