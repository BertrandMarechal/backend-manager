import { AwsS3 } from "../models/aws-s3.model";
import { PostgresUtils } from "../utils/postgres.utils";
import { LambdaFunction } from "../models/lambda-function";

const postgresDatabaseToUse = process.argv[2] ? 'localhost' : 'postgresdb';
const postgresPortToUse = process.argv[2] ? '5432' : '5433';

export class S3Server {
    private postgresUtils: PostgresUtils;

    constructor(postgresUtils: PostgresUtils) {
        this.postgresUtils = postgresUtils;
    }

    declareRoutes(app: any) {
        app.post('/s3/putObject', (req: any, res: any) => {
            let body = req.body;
            const awsS3 = new AwsS3();
            awsS3.putObject(body);
            res.send({Payload: 'ok'});
            this.callLambdaPostEVent(body, 's3:ObjectCreated');
        });
        app.post('/s3/deleteObject', (req: any, res: any) => {
            let body = req.body;
            const awsS3 = new AwsS3();
            awsS3.deleteObject(body);
            res.send({Payload: 'ok'});
            this.callLambdaPostEVent(body, 's3:ObjectDeleted');
        });
    }

    private callLambdaPostEVent(body: any, event: string) {
        this.postgresUtils.setConnectionString(`postgres://root:route@${postgresDatabaseToUse}:${postgresPortToUse}/postgres`);
        this.postgresUtils.executeFunction('mgtf_get_lambda_functions_for_s3_event', [event, body.Key, body.Bucket])
            .then((result: {
                mgtf_get_lambda_functions_for_s3_event: {
                    functionName: string,
                    fileName: string,
                    handlerFunctionName: string,
                    parameters: {
                        name: string,
                        value: string
                    }[]
                }[]
            }[]) => {
                console.log(result);

                const lambdaFunctions = result[0].mgtf_get_lambda_functions_for_s3_event.map(x => new LambdaFunction(x));

                lambdaFunctions.forEach((lambdaFunction) => {
                    lambdaFunction.call(
                        body.event,
                        body.context || { identity: { cognitoIdentityId: '12345-12345-12345-12345' } },
                        (error: any, result: any) => {})
                })
            })
            .catch((error: any) => {
                console.log(error);
            });
    }
}