export interface DatabaseVersionFileData {
    fileName: string;
    version: DatabaseVersionInformation[];
}


export interface DatabaseVersionDependency {
    application: string,
    version: string
}

export interface DatabaseVersionInformation {
    [name: string]: any;
    userToUse: string;
    databaseToUse: string;
    dependencies: DatabaseVersionDependency[];
    fileList: string[];
}