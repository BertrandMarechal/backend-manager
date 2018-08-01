import { AwsS3 } from "../models/aws-s3.model";
import { PostgresUtils } from "../utils/postgres.utils";
import { LambdaFunction } from "../models/lambda-function";
import { SubServerCommon } from "./sub-server-common";

export class S3Server extends SubServerCommon {
    constructor(postgresUtils: PostgresUtils) {
        super(postgresUtils)
    }

    declareRoutes(app: any) {
        app.post('/s3/putObject', (req: any, res: any) => {
            let body = req.body;
            const awsS3 = new AwsS3();
            awsS3.putObject(body);
            this.emitFromSubServer('s3 object created', {bucket: body.Bucket, key: body.Key});
            res.send({Payload: 'ok'});
            this.callLambdaPostEVent(body, 's3:ObjectCreated');
        });
        app.post('/s3/deleteObject', (req: any, res: any) => {
            let body = req.body;
            const awsS3 = new AwsS3();
            awsS3.deleteObject(body);
            this.emitFromSubServer('s3 object deleted', {bucket: body.Bucket, key: body.Key});
            res.send({Payload: 'ok'});
            this.callLambdaPostEVent(body, 's3:ObjectDeleted');
        });
    }

    private callLambdaPostEVent(body: any, event: string) {
        this.setConnectionString();
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
    
    attachSocket(client: any, emitFromSubServer: (event: string, data: any, clients?: string[]) => void) {
        super.attachSocket(client, emitFromSubServer);
    }
}