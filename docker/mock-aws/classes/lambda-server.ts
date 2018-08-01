import colors from "colors";
import { PostgresUtils } from "../utils/postgres.utils";
import { AwsServer } from "./aws-server";
import { LambdaFunction } from "../models/lambda-function";
import { SubServerCommon } from "./sub-server-common";

export class LambdaServer extends SubServerCommon {
    testSet: any[];
    constructor(postgresUtils: PostgresUtils) {
        super(postgresUtils);
        this.testSet = [];
    }

    declareRoutes(app: any) {
        app.get('/lambda', (req: any, res: any) => {
            res.send('<a href="/lambda/test-u/getuser">test getuser</a>');
        });
        app.get('/lambda/:service/:function', (req: any, res: any) => {
            this.emitFromSubServer('lambda function called', {functionName: req.params.function, serviceName: req.params.service});
            res.send('<a href="/lambda">back</a>');
        });
        app.post('/lambda/:service/:function', (req: any, res: any) => {
            this.emitFromSubServer('lambda function called', {functionName: req.params.function, serviceName: req.params.service});
            this.setConnectionString();
            this.postgresUtils.executeFunction('mgtf_get_lambda_function', [req.params.service, req.params.function])
                .then((result: {
                    mgtf_get_lambda_function: {
                        functionName: string,
                        fileName: string,
                        handlerFunctionName: string,
                        parameters: {
                            name: string,
                            value: string
                        }[]
                    }
                }[]) => {
                    const lambdaFunction = new LambdaFunction(result[0].mgtf_get_lambda_function);

                    let body = req.body;
                    console.log(colors.cyan(req.params.service) +
                        '-' + colors.green(req.params.function));
                    lambdaFunction.call(
                        body.event,
                        body.context || { identity: { cognitoIdentityId: '12345-12345-12345-12345' } },
                        (error: any, result: any) => {
                            this.emitFromSubServer('lambda function result', {functionName: req.params.function, serviceName: req.params.service});
                            this.testSet.push({
                                event: body.event,
                                context: body.context,
                                body: body,
                                result: result,
                                functionName: lambdaFunction.functionName,
                                apiName: lambdaFunction.serviceName,
                            });
                            AwsServer.sendDataBack(result, res);
                        })
                })
                .catch((error: any) => {
                    console.log(error);
                    AwsServer.sendErrorBack(error, res);
                });
        });
    }

    attachSocket(client: any, emitFromSubServer: (event: string, data: any, clients?: string[]) => void) {
        super.attachSocket(client, emitFromSubServer);
    }
}