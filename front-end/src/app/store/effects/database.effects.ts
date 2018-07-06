import { Injectable } from '@angular/core';
import { Effect, Actions } from '@ngrx/effects';
import { mergeMap, catchError, switchMap, withLatestFrom, debounceTime, delay } from 'rxjs/operators';
import { fromPromise } from 'rxjs/internal-compatibility';
import { Observable } from 'rxjs';
import { Store, Action } from '@ngrx/store';
import * as fromDatabase from '../reducers/database.reducers';
import * as froManagement from '../reducers/management.reducers';
import * as DatabaseActions from '../actions/database.actions';
import { DatabaseService } from '../../services/database.service';
import { Router } from '@angular/router';
import swal from 'sweetalert2';
import { DatabaseInstallationProgress } from '../../models/database.model';

@Injectable()
export class DatabaseEffects {
  @Effect()
  initializeDatabase: Observable<Action> = this.actions$
    .ofType(DatabaseActions.INITIALIZE_DATABASE_PAGE)
    .pipe(
      switchMap((action: DatabaseActions.InitializeDatabasePageAction) => {
        console.log(action);
        return fromPromise(
          this.databaseService.initializeDatabase(action.payload)
        ).pipe(
          mergeMap((data: any) => {
            return [
              {
                type: DatabaseActions.DATABASE_NOTHING_ACTION
              },
            ];
          }),
          catchError((error) => {
            return [
              {
                type: DatabaseActions.SERVICE_INITIALIZE_DATABASE_FAILED,
                payload: error.message
              },
            ];
          })
        );
      })
    );
  @Effect()
  createNewVersion: Observable<Action> = this.actions$
    .ofType(DatabaseActions.CREATE_NEW_VERSION_PAGE)
    .pipe(
      switchMap((action: DatabaseActions.CreateNewVersionPageAction) => {
        return fromPromise(
          this.databaseService.createNewDatabaseVersion(action.payload)
        ).pipe(
          mergeMap((data: any) => {
            return [
              {
                type: DatabaseActions.DATABASE_NOTHING_ACTION,
                payload: data
              },
            ];
          }),
          catchError((error) => {
            return [
              {
                type: DatabaseActions.SERVICE_CREATE_NEW_VERSION_FAILED,
                payload: error.message
              },
            ];
          })
        );
      })
    );
  @Effect()
  prepareUpdateObject: Observable<Action> = this.actions$
    .ofType(DatabaseActions.PREPARE_UPDATE_OBJECT_PAGE_ACTION)
    .pipe(
      withLatestFrom(this.store.select('databaseManagement')),
      switchMap(([action, state]: any[]) => {
        return fromPromise(
          this.databaseService.prepareUpdateObject({
            ...action.payload,
            repoName: state.selectedDatabase.name
          })
        ).pipe(
          mergeMap((data: any) => {
            return [
              {
                type: DatabaseActions.DATABASE_NOTHING_ACTION,
                payload: data
              },
            ];
          }),
          catchError((error) => {
            return [
              {
                type: DatabaseActions.SERVICE_PREPARE_UPDATE_OBJECT_FAILED,
                payload: error.message
              },
            ];
          })
        );
      })
    );
  @Effect()
  setVersionAsInstalled: Observable<Action> = this.actions$
    .ofType(DatabaseActions.SET_VERSION_AS_INSTALLED_PAGE_ACTION)
    .pipe(
      withLatestFrom(this.store.select('databaseManagement')),
      switchMap(([action, state]: any[]) => {
        console.log(action, state);
        return fromPromise(
          this.databaseService.setVersionAsInstalled({
            ...action.payload,
            repoName: state.selectedDatabase.name
          })
        ).pipe(
          mergeMap((data: any) => {
            return [
              {
                type: DatabaseActions.DATABASE_NOTHING_ACTION,
                payload: data
              },
            ];
          }),
          catchError((error) => {
            return [
              {
                type: DatabaseActions.SERVICE_SET_VERSION_AS_INSTALLED_FAILED,
                payload: error.message
              },
            ];
          })
        );
      })
    );
  @Effect()
  saveSetting: Observable<Action> = this.actions$
    .ofType(DatabaseActions.SAVE_SETTING_PAGE)
    .pipe(
      // debounceTime(1000),
      withLatestFrom(this.store.select('databaseManagement')),
      switchMap(([action, state]: any[]) => {
        return fromPromise(
          this.databaseService.updateSetting({
            ...action.payload,
            repoName: state.selectedDatabase.name
          })
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
                type: DatabaseActions.SERVICE_SAVE_SETTING_COMPLETE,
                payload: data
              },
            ];
          }),
          catchError((error) => {
            return [
              {
                type: DatabaseActions.SERVICE_SAVE_SETTING_FAILED,
                payload: error.message
              },
            ];
          })
        );
      })
    );


  @Effect()
  saveSettingComplete: Observable<Action> = this.actions$
    .ofType(DatabaseActions.SERVICE_SAVE_SETTING_COMPLETE)
    .pipe(
      delay(2500),
      switchMap((action: DatabaseActions.ServiceSaveSettingCompleteAction) => {
        return [
          {
            type: DatabaseActions.SERVICE_SAVE_SETTING_UPDATING_WIPE
          },
        ];
      }),
  );
  @Effect()
  selectDatabase: Observable<Action> = this.actions$
    .ofType(DatabaseActions.SELECT_DATABASE_PAGE_ACTION)
    .pipe(
      withLatestFrom(this.store.select('databaseManagement')),
      switchMap(([action, state]: any[]) => {
        this.router.navigate(['/management', 'databases', state.selectedDatabase.name]);
        return [
          {
            type: DatabaseActions.DATABASE_NOTHING_ACTION
          },
        ];
      }),
  );

  @Effect()
  installDatabases: Observable<Action> = this.actions$
    .ofType(DatabaseActions.INSTALL_DATABASES_PAGE_ACTION)
    .pipe(
      withLatestFrom(this.storeManagement.select('management')),
      switchMap(([action, stateManagement]: any) => {
        return fromPromise(
          this.databaseService.installDatabase({
            ...action.payload,
            environment: stateManagement.environment
          }),
        ).pipe(
          mergeMap(() => {
            this.router.navigate(['/management', 'databases', 'install', 'log-progress']);
            return [
              {
                type: DatabaseActions.DATABASE_NOTHING_ACTION
              },
            ];
          }),
          catchError(error => {
            return [
              {
                type: DatabaseActions.SERVICE_INSTALL_DATABASES_FAILED,
                payload: error.message,
              },
            ];
          }),
        );
      }),
  );
  @Effect()
  installDatabasesComplete: Observable<Action> = this.actions$
    .ofType(
      DatabaseActions.SERVICE_INSTALL_DATABASES_COMPLETE,
    )
    .pipe(
      switchMap(() => {
        const toast = (swal as any).mixin({
          toast: true,
          position: 'bottom-end',
          showConfirmButton: false,
          timer: 3000
        });
        toast({
          type: 'success',
          title: 'Database installed'
        });
        return [
          {
            type: DatabaseActions.DATABASE_NOTHING_ACTION
          },
        ];
      }),
  );
  @Effect()
  installDatabasesFailed: Observable<Action> = this.actions$
    .ofType(
      DatabaseActions.SERVICE_INSTALL_DATABASES_FAILED,
    )
    .pipe(
      withLatestFrom(this.store.select('databaseManagement')),
      switchMap(([action, state]: any[]) => {
        console.log(typeof action.payload);
        if (typeof action.payload !== 'string') {
          const firstScriptFailing = state.installationProgressArray.reduce((current: string, x: DatabaseInstallationProgress) => {
            const wasInstalling = x.installing;
            if (wasInstalling) {
              current = x.files.reduce((currentY, y) => {
                if (!y.done && currentY === '') {
                  currentY = x.repoName + y.fileName;
                }
                return currentY;
              }, '');
            }
            return current;
          }, '');
          swal({
            type: 'error',
            title: 'Script failed',
            html: 'The following script failed: <br/>' + firstScriptFailing
          });
        } else {
          console.log(action);
          swal({
            type: 'error',
            title: 'Script failed',
            text: action.payload
          });
        }
        return [
          {
            type: DatabaseActions.DATABASE_NOTHING_ACTION
          },
        ];
      }),
  );
  constructor(
    private actions$: Actions,
    private databaseService: DatabaseService,
    private store: Store<fromDatabase.FeatureState>,
    private storeManagement: Store<froManagement.FeatureState>,
    private router: Router) {

  }
}
