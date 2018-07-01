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
