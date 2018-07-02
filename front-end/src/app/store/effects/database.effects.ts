import { Injectable } from '@angular/core';
import { Effect, Actions } from '@ngrx/effects';
import { mergeMap, catchError, switchMap, withLatestFrom } from 'rxjs/operators';
import { fromPromise } from 'rxjs/internal-compatibility';
import { Observable } from 'rxjs';
import { Store, Action } from '@ngrx/store';
import * as fromDatabase from '../reducers/database.reducers';
import * as DatabaseActions from '../actions/database.actions';
import { DatabaseService } from '../../services/database.service';
import { Router } from '@angular/router';

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
  selectDatabase: Observable<Action> = this.actions$
    .ofType(DatabaseActions.SELECT_DATABASE_PAGE_ACTION)
    .pipe(
      withLatestFrom(this.store.select('databaseManagement')),
      switchMap(([action, state]: any[]) => {
        this.router.navigate(['/management', 'databases', state.selectedDatabase.name]);
        console.log(state);
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
    private router: Router) {

  }
}
