import { PostgresUtils } from "../utils/postgres.utils";

const postgresDatabaseToUse = process.argv[2] ? 'localhost' : 'postgresdb';
const postgresPortToUse = process.argv[2] ? '5432' : '5433';

export class SubServerCommon {
    protected postgresUtils: PostgresUtils;
    protected emitFromSubServer: (event: string, data: any, clients?: string[]) => void;

    constructor(postgresUtils: PostgresUtils) {
        this.postgresUtils = postgresUtils;
        this.emitFromSubServer = (event: string, data: any, clients?: string[]) => {
            console.log('Super emit not defined yet');
        };
    }

    declareRoutes(app: any) {}

    attachSocket(client: any, emitFromSubServer: (event: string, data: any, clients?: string[]) => void) {
        this.emitFromSubServer = emitFromSubServer;
    }

    setConnectionString() {
        this.postgresUtils.setConnectionString(`postgres://root:route@${postgresDatabaseToUse}:${postgresPortToUse}/postgres`);
    }
}