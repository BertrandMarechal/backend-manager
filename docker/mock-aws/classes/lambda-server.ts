import colors from "colors";
import { PostgresUtils } from "../utils/postgres.utils";
import { AwsServer } from "./aws-server";
import { LambdaFunction } from "../models/lambda-function";

const postgresDatabaseToUse = process.argv[2] ? 'localhost' : 'postgresdb';
const postgresPortToUse = process.argv[2] ? '5432' : '5433';

export class LambdaServer {
    testSet: any[];

    private postgresUtils: PostgresUtils;

    constructor(postgresUtils: PostgresUtils) {
        this.postgresUtils = postgresUtils;
        this.testSet = [];
    }

    declareRoutes(app: any) {
        app.post('/lambda/:service/:function', (req: any, res: any) => {
            this.postgresUtils.setConnectionString(`postgres://root:route@${postgresDatabaseToUse}:${postgresPortToUse}/postgres`);
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
                    console.log(result);

                    const lambdaFunction = new LambdaFunction(result[0].mgtf_get_lambda_function);

                    let body = req.body;
                    console.log(colors.cyan(req.params.service) +
                        '-' + colors.green(req.params.function));
                    lambdaFunction.call(
                        body.event,
                        body.context || { identity: { cognitoIdentityId: '12345-12345-12345-12345' } },
                        (error: any, result: any) => {
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
}