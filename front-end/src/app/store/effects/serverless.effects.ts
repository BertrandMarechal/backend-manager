import { Injectable } from '@angular/core';
import { Effect, Actions } from '@ngrx/effects';
import { Observable } from 'rxjs';
import { Store, Action } from '@ngrx/store';
import * as ServerlessActions from '../actions/serverless.actions';
import * as ManagementActions from '../actions/management.actions';
import * as fromServerless from '../reducers/serverless.reducers';
import { withLatestFrom, switchMap, mergeMap, catchError, delay } from 'rxjs/operators';
import { Router } from '@angular/router';
import { fromPromise } from '../../../../node_modules/rxjs/internal-compatibility';
import { ServerlessService } from '../../services/serverless.service';
import swal from 'sweetalert2';

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
    @Effect()
    saveSetting: Observable<Action> = this.actions$
      .ofType(ServerlessActions.SAVE_SERVERLESS_SETTING_PAGE)
      .pipe(
        withLatestFrom(this.store.select('serverless')),
        switchMap(([action, state]: [ServerlessActions.SaveServerlessSettingPageAction, fromServerless.State]) => {
          return fromPromise(
            this.serverlessService.updateSetting(action.payload)
          ).pipe(
            mergeMap((data: any) => {
              const toast = (swal as any).mixin({
                toast: true,
                position: 'bottom-end',
                showConfirmButton: false,
                timer: 3000
              });
              toast({
                type: 'success',
                title: 'Setting saved'
              });
              console.log(data);
              return [
                {
                  type: ServerlessActions.SERVICE_SAVE_SERVERLESS_SETTING_COMPLETE,
                  payload: data
                },
              ];
            }),
            catchError((error) => {
              return [
                {
                  type: ServerlessActions.SERVICE_SAVE_SERVERLESS_SETTING_FAILED,
                  payload: error.message
                },
              ];
            })
          );
        })
      );
      @Effect()
      saveSettingComplete: Observable<Action> = this.actions$
        .ofType(ServerlessActions.SERVICE_SAVE_SERVERLESS_SETTING_COMPLETE)
        .pipe(
          delay(2500),
          switchMap((action: ServerlessActions.ServiceSaveServerlessSettingCompleteAction) => {
            return [
              {
                type: ServerlessActions.SERVICE_SAVE_SERVERLESS_SETTING_UPDATING_WIPE
              },
            ];
          }),
      );
    constructor(
        private actions$: Actions,
        private store: Store<fromServerless.FeatureState>,
        private serverlessService: ServerlessService,
        private router: Router
    ) {

    }
}