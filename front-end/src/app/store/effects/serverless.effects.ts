import { Injectable } from '@angular/core';
import { Effect, Actions } from '@ngrx/effects';
import { Observable } from 'rxjs';
import { Store, Action } from '@ngrx/store';
import * as ServerlessActions from '../actions/serverless.actions';
import * as ManagementActions from '../actions/management.actions';
import * as fromServerless from '../reducers/serverless.reducers';
import { withLatestFrom, switchMap, mergeMap, catchError, delay } from 'rxjs/operators';
import { Router } from '@angular/router';
import { fromPromise } from 'rxjs/internal-compatibility';
import { ServerlessService } from '../../services/serverless.service';
import swal, { SweetAlertResult } from 'sweetalert2';
import { RepositoryParameter } from '../../models/database.model';

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
          withLatestFrom(this.store.select('serverless')),
          mergeMap(([data, state]: [any, fromServerless.State]) => {
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
            const servicesToUpdate = state.selectedServerlessRepo.middleTiers
              .filter(x => {
                return x.serviceName !== state.currentUpdatingSettings.serviceName &&
                  x.variables[state.currentUpdatingSettings.environment]
                    .filter((y: RepositoryParameter) => {
                      return y.name === state.currentUpdatingSettings.settingName &&
                        y.value !== state.currentUpdatingSettings.settingValue;
                    }).length > 0;
              });
            if (servicesToUpdate.length === 0) {
              return [
                {
                  type: ServerlessActions.SERVICE_SAVE_SERVERLESS_SETTING_COMPLETE,
                  payload: data
                },
              ];
            } else {
              return [
                {
                  type: ServerlessActions.SERVICE_SAVE_SERVERLESS_SETTING_COMPLETE,
                  payload: data
                },
                {
                  type: ServerlessActions.SERVICE_SAVE_SERVERLESS_SETTING_FOR_OTHER,
                  payload: servicesToUpdate.map(x => {
                    return {
                      ...state.currentUpdatingSettings,
                      serviceName: x.serviceName,
                    };
                  })
                },
              ];
            }
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
    saveServerlessSettingForOther: Observable<Action> = this.actions$
    .ofType(ServerlessActions.SERVICE_SAVE_SERVERLESS_SETTING_FOR_OTHER)
    .pipe(
      switchMap((action: ServerlessActions.SaveServerlessSettingForOtherServiceAction) => {
        if (action.payload[0].fromService) {
          return action.payload.splice(0, 1).map(x => {
            return {
              type: ServerlessActions.SAVE_SERVERLESS_SETTING_PAGE,
              payload: {...x, fromService: true}
            };
          });
        } else {
          return fromPromise(swal({
            type: 'info',
            text: `There are ${action.payload.length} similar vriables on this middle tier repository. 
            Do you want to set up the same value to all ?`,
            showLoaderOnConfirm: true,
            showCancelButton: true,
            confirmButtonText: 'Apply for all',
            cancelButtonText: 'Nope',
            preConfirm: () => Promise.resolve(action.payload)
          })).pipe(
            switchMap((result: SweetAlertResult) => {
              console.log(result);
              if (result.dismiss) {
                return [{
                  type: ServerlessActions.SERVERLESS_NOTHING_ACTION
                }];
              } else {
                return result.value.splice(0, 1).map(x => {
                  return {
                    type: ServerlessActions.SAVE_SERVERLESS_SETTING_PAGE,
                    payload: {...x, fromService: true}
                  };
                });
              }
            })
          );
        }
      }),
      catchError((error) => {
        return [
          {
            type: ServerlessActions.SERVICE_SAVE_SERVERLESS_SETTING_FAILED,
            payload: error.message
          },
        ];
      })
    )
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