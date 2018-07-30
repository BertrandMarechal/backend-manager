import colors from "colors";
import { PostgresUtils } from "../utils/postgres.utils";
import { AwsServer } from "./aws-server";

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
            this.postgresUtils.executeFunction('mgtf_get_lambda_function')
                .then((data: any) => {
                    console.log(data);
                    AwsServer.sendDataBack(data, res);
                })
                .catch((error: any) => {
                    AwsServer.sendErrorBack(error, res);
                });
        //     const lambdaFunction = this.functions.find((x: LambdaFunction) => {
        //         return x.serviceName === req.params.service &&
        //             x.functionName === req.params.function;
        //     });
        //     if (lambdaFunction) {
        //         const functionApplication = Object.keys(this.settings).find(x => {
        //             return lambdaFunction.fileName.indexOf(this.settings[x].middleTierRepoName) > -1;
        //         });
        //         let body = req.body;
        //         console.log(colors.cyan(lambdaFunction.serviceName) +
        //             '-' + colors.green(lambdaFunction.functionName));
        //         // console.log(colors.yellow(JSON.stringify(body.event)));
        //         lambdaFunction.call(
        //             this.settings[<string>functionApplication],
        //             body.event,
        //             body.context || {identity: {cognitoIdentityId: 'bertrand.marechal@cordantgroup.com_cad'}},
        //             (error: any, result: any) => {
        //                 // setTimeout(() => {
        //                 this.testSet.push({
        //                     event: body.event,
        //                     context: body.context,
        //                     body: body,
        //                     result: result,
        //                     functionName: lambdaFunction.functionName,
        //                     apiName: lambdaFunction.serviceName,
        //                 });
        //                 // console.log(colors.magenta(JSON.stringify(result)));
        //                     res.send(result);
        //                 // }, Math.random() * 250 + 100);
        //             })
        //     } else {
        //         console.log(colors.red('Function not found : ' + req.params.service + '-' + req.params.function));
        //     }
        });
    }
}