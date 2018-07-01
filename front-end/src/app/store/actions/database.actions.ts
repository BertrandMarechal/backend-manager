import { Action } from '@ngrx/store';

export const INITIALIZE_DATABASE_PAGE = '[Database Page] INITIALIZE_DATABASE';
export const SERVICE_INITIALIZE_DATABASE_COMPLETE = '[Database Service] INITIALIZE_DATABASE complete';
export const SERVICE_INITIALIZE_DATABASE_FAILED = '[Database Service] INITIALIZE_DATABASE failed';

export class InitializeDatabasePageAction implements Action {
readonly type  = INITIALIZE_DATABASE_PAGE;
constructor(public payload?: {repoName: string, dbAlias: string}) {}
}
export class ServiceInitializeDatabaseCompleteAction implements Action {
readonly type  = SERVICE_INITIALIZE_DATABASE_COMPLETE;
constructor(public payload?: any) {}
}
export class ServiceInitializeDatabaseFailedAction implements Action {
readonly type  = SERVICE_INITIALIZE_DATABASE_FAILED;
constructor(public payload?: string) {}
}

export const CREATE_NEW_VERSION_PAGE = '[Database Page] CREATE_NEW_VERSION';
export const SERVICE_CREATE_NEW_VERSION_COMPLETE = '[Database Service] CREATE_NEW_VERSION complete';
export const SERVICE_CREATE_NEW_VERSION_FAILED = '[Database Service] CREATE_NEW_VERSION failed';

export class CreateNewVersionPageAction implements Action {
readonly type  = CREATE_NEW_VERSION_PAGE;
constructor(public payload?: string) {}
}
export class ServiceCreateNewVersionCompleteAction implements Action {
readonly type  = SERVICE_CREATE_NEW_VERSION_COMPLETE;
constructor(public payload?: any) {}
}
export class ServiceCreateNewVersionFailedAction implements Action {
readonly type  = SERVICE_CREATE_NEW_VERSION_FAILED;
constructor(public payload?: string) {}
}

export const DATABASE_NOTHING_ACTION = '[Database] nothing';

export class DatabaseNothingAction implements Action {
readonly type  = DATABASE_NOTHING_ACTION;
}

export type DatabaseActions =
  | InitializeDatabasePageAction
  | ServiceInitializeDatabaseCompleteAction
  | ServiceInitializeDatabaseFailedAction
  | CreateNewVersionPageAction
  | ServiceCreateNewVersionCompleteAction
  | ServiceCreateNewVersionFailedAction
  | DatabaseNothingAction;
