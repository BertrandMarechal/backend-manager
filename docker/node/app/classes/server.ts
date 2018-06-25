import express from 'express';
import * as http from 'http';
import * as bodyParser from 'body-parser';
import * as path from 'path';
import {PostgresUtils} from './postgres.utils';


export class Server {
    private app: any;
    private server: any;
    private httpServer: any;
    private postgresUtils: PostgresUtils;

    constructor() {
        this.postgresUtils = new PostgresUtils();
        this.postgresUtils.setConnectionString('postgres://root:route@postgresdb:5432/postgres');
        // this.postgresUtils.setConnectionString('postgres://app_user_cad:app_user@localhost:5432/local_cad');
    }

    static logServerEvents(message: string) {
        console.log('SERVER - ' + message);
    }

    listenHere(port: string) {
        this.app = express();
        this.server = http.createServer(this.app);
        this.app.use((req: any, res: any, next: any) => {
            res.header("Access-Control-Allow-Origin", "*");
            res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
            next();
        });

        this.app.use(bodyParser.urlencoded({ extended: true, limit: '50mb' }));
        this.app.use( bodyParser.json({limit: '50mb'}) );       // to support JSON-encoded bodies
        
        this.app.get('/', function(req: any, res: any) {
            res.sendFile(path.resolve('./index.html'));
        });
        this.app.post('/query', (req: any, res: any) => {
            const body:{
                query: string
            } = req.body;
            
            this.postgresUtils.execute(body.query)
                .then((result) => {
                    res.send(result);
                })
                .catch(result => {
                    console.log(result);
                    res.send(result);
                });
        });

        this.server.listen(port/*, "localhost"*/, (error: any) => {
            console.log('listening');
        });
    }
}