import PGP from 'pg-promise';

export class PostgresUtils {
    db: any;
    pgp: any;
    private connectionString: string;
    connections: {
        [connectionString: string]: any
    };

    constructor() {
        this.connectionString = '';
        this.pgp = PGP();
        this.connections = {};
    }

    setConnectionString(connectionString: string) {
        if (this.connectionString !== connectionString) {
            this.connectionString = connectionString;
            if (!this.connections[this.connectionString]) {
                this.connections[this.connectionString] = this.pgp(this.connectionString);
            }
            this.db = this.connections[this.connectionString];
        }
    }

    execute(sql: string): Promise<any> {
        return new Promise((resolve, reject) => {
            this.db.any(sql)
                .then((data: any) => {
                    this.endConnection();
                    resolve(data);
                })
                .catch((error: any) => {
                    console.log(sql);
                    console.log(error);
                    reject(error);
                    this.endConnection();
                });
        });
    }

    endConnection() {
        // this.db.$pool.end();
        this.pgp.end();
    }
}