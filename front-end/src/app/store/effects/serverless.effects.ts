import { Injectable } from '@angular/core';
import { Effect, Actions } from '@ngrx/effects';
import { Observable } from 'rxjs';
import { Store, Action } from '@ngrx/store';
import * as ServerlessActions from '../actions/serverless.actions';
import * as fromServerless from '../reducers/serverless.reducers';
import { withLatestFrom, switchMap } from 'rxjs/operators';
import { Router } from '@angular/router';

@Injectable()
export class ServerlessEffects {
    @Effect()
    selectServerless: Observable<Action> = this.actions$
        .ofType(ServerlessActions.SELECT_SERVERLESS_PAGE_ACTION)
        .pipe(
            withLatestFrom(this.store.select('serverless')),
            switchMap(([action, state]: any[]) => {
                this.router.navigate(['/management', 'serverless-repos', state.selectedServerlessRepo.name]);
                return [
                    {
                        type: ServerlessActions.SERVERLESS_NOTHING_ACTION
                    },
                ];
            }),
    );
    constructor(
        private actions$: Actions,
        private store: Store<fromServerless.FeatureState>,
        private router: Router
    ) {

    }
}