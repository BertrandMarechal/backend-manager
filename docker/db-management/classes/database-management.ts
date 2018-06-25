import { PostgresUtils } from "../utils/postgres.utils";

export class DatabaseManagement {
    postgresUtils: PostgresUtils;

    constructor() {
        this.postgresUtils = new PostgresUtils();
        this.postgresUtils.setConnectionString(process.argv[2]?'postgres://root:route@localhost:5432/postgres':'postgres://root:route@postgresdb:5432/postgres')
    }

    execute (functionName: string, data?: any[]): Promise<any> {
        return this.postgresUtils.executeFunction(functionName, data)
    }
}