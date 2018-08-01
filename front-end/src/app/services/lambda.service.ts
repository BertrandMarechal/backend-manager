import { LocalhostService } from './localhost.service';
import { Injectable } from '../../../node_modules/@angular/core';

@Injectable()
export class LambdaService {
    constructor(
        private localhostService: LocalhostService
    ) {
        this.localhostService.hookLambdaCallback('lambda function called', (data) => {
            console.log(data);
        });
        this.localhostService.hookLambdaCallback('lambda function result', (data) => {
            console.log(data);
        });
    }
}