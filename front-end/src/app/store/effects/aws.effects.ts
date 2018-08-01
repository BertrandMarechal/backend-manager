import { Injectable } from '@angular/core';
import { Effect, Actions } from '@ngrx/effects';
import { LambdaService } from '../../services/lambda.service';
import { mergeMap, catchError, switchMap, withLatestFrom, debounceTime, delay } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { Store, Action } from '@ngrx/store';
import * as AwsActions from '../../store/actions/aws.actions';
import { Router } from '@angular/router';

@Injectable()
export class AwsEffects {
    @Effect({ dispatch: false })
    navigateToFunctions: Observable<Action> = this.actions$
        .ofType(
            AwsActions.PAGE_NAVIGATE_TO_FUNCTIONS
        )
        .pipe(
            switchMap(([action, state]: any[]) => {
                this.router.navigate(['/management', 'aws', 'lambda-functions']);
                return [
                    {
                        type: AwsActions.AwsNothing
                    },
                ];
            }),
    );
    constructor(
        private actions$: Actions,
        private lambdaService: LambdaService,
        private router: Router
    ) {

    }
}