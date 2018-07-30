import { AwsServer } from "./aws-server";
import { PostgresUtils } from "../utils/postgres.utils";
import { FileUtils } from "../utils/file.utils";

const postgresDatabaseToUse = process.argv[2] ? 'localhost' : 'postgresdb';
const postgresPortToUse = process.argv[2] ? '5432' : '5433';

export class KmsServer {
    private postgresUtils: PostgresUtils;

    constructor(postgresUtils: PostgresUtils) {
        this.postgresUtils = postgresUtils;
        this.runAwsDatabaseInstallationScript();
    }
    declareRoutes(app: any) {
        app.get('/kms/:keyId', (req: any, res: any) => {
            console.log('/kms/:keyId - get');
            console.log(req.params.keyId);
            console.log(decodeURIComponent(req.query.path));
            
            AwsServer.sendDataBack({}, res);
        });
        
        app.post('/:keyId', (req: any, res: any) => {
            console.log('/kms/:keyId - post');
            const body: {
                path: string,
                value: string
            } = req.body;

            this.postgresUtils.setConnectionString(`postgres://root:route@${postgresDatabaseToUse}:${postgresPortToUse}/postgres`);
            this.postgresUtils.executeFunction('mgtf_save_kms_key')
                .then((data: any) => {
                    AwsServer.sendDataBack(data, res);
                })
                .catch((error: any) => {
                    AwsServer.sendErrorBack(error, res);
                });
        });
    }

    private runAwsDatabaseInstallationScript(): Promise<any> {
        console.log('This step is made to run the SQL scripts on starting the ser on local use.');
        console.log('WAIT FOR IT TO END before doing anything.');
        console.log('REMOVE it on real use case.');
        console.log('### STARTING ###');
        return new Promise((resolve, reject) => {
            FileUtils.getFileList({
                startPath: './sql',
                filter: /\.sql/
            })
                .then((fileList) => {
                    console.log(fileList.length + ' files to run');
                    this.runFiles(fileList)
                        .then(resolve)
                        .catch(reject);
                });
        });
    }

    private runFiles(fileList: string[]): Promise<any> {
        if (fileList.length > 0) {
            return new Promise((resolve, reject) => {
                FileUtils.readFile(fileList[0])
                    .then((command: any) => {
                        console.log('Running ' + fileList[0]);
                        this.postgresUtils.execute(command)
                            .then(() => {
                                fileList.splice(0, 1);
                                return this.runFiles(fileList).then(resolve).catch(reject);
                            })
                            .catch(() => {
                                reject();
                            });
                    })
            });
        } else {
            console.log('### DONE ###');
            return Promise.resolve();
        }
    }
}