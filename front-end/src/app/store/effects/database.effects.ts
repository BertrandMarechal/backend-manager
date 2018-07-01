import { Injectable } from '@angular/core';
import { Effect, Actions } from '@ngrx/effects';
import { mergeMap, catchError, switchMap, withLatestFrom } from 'rxjs/operators';
import { fromPromise } from 'rxjs/internal-compatibility';
import { Observable } from 'rxjs';
import { Store, Action } from '@ngrx/store';
import * as fromDatabase from '../reducers/database.reducers';
import * as fromManagement from '../reducers/management.reducers';
import * as DatabaseActions from '../actions/database.actions';
import { DatabaseService } from '../../services/database.service';

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
  constructor(
    private actions$: Actions,
    private databaseService: DatabaseService,
    private store: Store<fromDatabase.FeatureState>,
    private storeManagement: Store<fromManagement.FeatureState>) {

  }
}
