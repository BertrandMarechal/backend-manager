import { LocalhostService } from './localhost.service';
import { Injectable } from '@angular/core';
import * as fromAws from '../store/reducers/aws.reducers';
import * as AwsActions from '../store/actions/aws.actions';
import { Store } from '@ngrx/store';

@Injectable()
export class LambdaService {
    constructor(
        private localhostService: LocalhostService,
        private store: Store<fromAws.State>,
    ) {
        this.localhostService.hookLambdaCallback('lambda function called', (data) => {
            this.store.dispatch(new AwsActions.LambdaServiceFunctionCalled(data));
        });
        this.localhostService.hookLambdaCallback('lambda function result', (data) => {
            console.log(data);
            this.store.dispatch(new AwsActions.LambdaServiceFunctionResult(data));
        });
    }
}