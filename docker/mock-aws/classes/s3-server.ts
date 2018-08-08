import { AwsS3, S3SignedUrlType, S3ObjectSignedUrlData } from "../models/aws-s3.model";
import { PostgresUtils } from "../utils/postgres.utils";
import { LambdaFunction } from "../models/lambda-function";
import { SubServerCommon } from "./sub-server-common";



export class S3Server extends SubServerCommon {
    awsS3: AwsS3;

    constructor(postgresUtils: PostgresUtils) {
        super(postgresUtils);
        this.awsS3 = new AwsS3();
    }

    declareRoutes(app: any) {
        app.post('/s3/putObject', (req: any, res: any) => {
            let body = req.body;
            this.awsS3.putObject(body)
                .then(() => {
                    
                    this.postgresUtils
                    .executeFunction('mgtf_insert_s3_object', [
                        body.Bucket,
                        body.Key,
                        body.ContentType,
                        body.ACL,
                        body.Metadata,
                        body.Tags,
                        true
                    ])
                    .then(() => {
                        this.emitFromSubServer('s3 object created', {bucket: body.Bucket, key: body.Key});
                        res.send({Payload: 'ok'});
                        this.callLambdaPostEVent(body, 's3:ObjectCreated');
                    })
                    .catch(console.log);
                }).catch(console.log);
        });
        app.post('/s3/getObject', (req: any, res: any) => {
            let body: {
                Bucket: string,
                Key: string
            } = req.body;
            this.awsS3.getObject(body).then((data) => {
                res.send(data);
            });
        });
        app.post('/s3/deleteObject', (req: any, res: any) => {
            let body = req.body;
            this.awsS3.deleteObject(body);
            this.emitFromSubServer('s3 object deleted', {bucket: body.Bucket, key: body.Key});
            res.send({Payload: 'ok'});
            this.callLambdaPostEVent(body, 's3:ObjectDeleted');
        });
        app.post('/s3/getSignedUrl/:action', (req: any, res: any) => {
            let body: S3ObjectSignedUrlData = req.body;
            const action: S3SignedUrlType = req.params.action;
            this.awsS3.getSignedUrl(action, body, this.postgresUtils)
                .then((data) => {
                    res.send(data);
                    this.emitFromSubServer('s3 signed url ' + action, {bucket: body.Bucket, key: body.Key});
                });
        });
        app.post('/s3/uploadObject/:key', (req: any, res: any) => {
            this.postgresUtils.executeFunction('mgtf_get_s3_object_data', [+req.params.key])
                .then((data: {mgtf_get_s3_object_data: S3ObjectSignedUrlData}) => {
                    let body = {
                        ...data.mgtf_get_s3_object_data,
                        Body: req.body
                    };
                    this.awsS3.putObject(body)
                        .then(() => {
                            this.postgresUtils
                                .executeFunction('mgtf_s3_object_uploaded', [+req.params.key])
                                .then(() => {
                                    this.emitFromSubServer('s3 object created', {bucket: body.Bucket, key: body.Key});
                                    res.send({Payload: 'ok'});
                                    this.callLambdaPostEVent(body, 's3:ObjectCreated');
                                })
                                .catch(console.log);
                        })
                        .catch(console.log);
                })
                .catch(console.log)
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
                const s3Event = {
                    Records: [{
                        s3: {
                            bucket: {
                                name: body.Bucket
                            },
                            object: {
                                key: body.Key
                            }
                        }
                    }]
                };

                const lambdaFunctions = result[0].mgtf_get_lambda_functions_for_s3_event.map(x => new LambdaFunction(x));

                lambdaFunctions.forEach((lambdaFunction) => {
                    lambdaFunction.call(
                        s3Event,
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