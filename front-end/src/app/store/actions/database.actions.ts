import { Action } from '@ngrx/store';
import { RepositoryFile } from '../../models/database.model';

export const DATABASE_REPOSITORIES_UPDATED = '[Management effect] Repositories updated';
export class RepositoriesUpdatedEffectAction implements Action {
  readonly type = DATABASE_REPOSITORIES_UPDATED;
  constructor(public payload?: RepositoryFile[]) { }
}

export const INITIALIZE_DATABASE_PAGE = '[Database Page] INITIALIZE_DATABASE';
export const SERVICE_INITIALIZE_DATABASE_COMPLETE = '[Database Service] INITIALIZE_DATABASE complete';
export const SERVICE_INITIALIZE_DATABASE_FAILED = '[Database Service] INITIALIZE_DATABASE failed';

export class InitializeDatabasePageAction implements Action {
  readonly type = INITIALIZE_DATABASE_PAGE;
  constructor(public payload?: { repoName: string, dbAlias: string }) { }
}
export class ServiceInitializeDatabaseCompleteAction implements Action {
  readonly type = SERVICE_INITIALIZE_DATABASE_COMPLETE;
  constructor(public payload?: any) { }
}
export class ServiceInitializeDatabaseFailedAction implements Action {
  readonly type = SERVICE_INITIALIZE_DATABASE_FAILED;
  constructor(public payload?: string) { }
}

export const CREATE_NEW_VERSION_PAGE = '[Database Page] CREATE_NEW_VERSION';
export const SERVICE_CREATE_NEW_VERSION_COMPLETE = '[Database Service] CREATE_NEW_VERSION complete';
export const SERVICE_CREATE_NEW_VERSION_FAILED = '[Database Service] CREATE_NEW_VERSION failed';

export class CreateNewVersionPageAction implements Action {
  readonly type = CREATE_NEW_VERSION_PAGE;
  constructor(public payload?: string) { }
}
export class ServiceCreateNewVersionCompleteAction implements Action {
  readonly type = SERVICE_CREATE_NEW_VERSION_COMPLETE;
  constructor(public payload?: any) { }
}
export class ServiceCreateNewVersionFailedAction implements Action {
  readonly type = SERVICE_CREATE_NEW_VERSION_FAILED;
  constructor(public payload?: string) { }
}

export const PREPARE_UPDATE_OBJECT_PAGE_ACTION = '[Database Page] PREPARE_UPDATE_OBJECT';
export const SERVICE_PREPARE_UPDATE_OBJECT_COMPLETE = '[Database Service] PREPARE_UPDATE_OBJECT complete';
export const SERVICE_PREPARE_UPDATE_OBJECT_FAILED = '[Database Service] PREPARE_UPDATE_OBJECT failed';

export class PrepareUpdateObjectPageAction implements Action {
readonly type  = PREPARE_UPDATE_OBJECT_PAGE_ACTION;
constructor(public payload?: {repoName: string, fileName: string, mode: string}) {}
}
export class ServicePrepareUpdateObjectCompleteAction implements Action {
readonly type  = SERVICE_PREPARE_UPDATE_OBJECT_COMPLETE;
constructor(public payload?: any) {}
}
export class ServicePrepareUpdateObjectFailedAction implements Action {
readonly type  = SERVICE_PREPARE_UPDATE_OBJECT_FAILED;
constructor(public payload?: string) {}
}

export const SELECT_DATABASE_PAGE_ACTION =
  '[Databases Page] select database';
export class SelecteDatabasePageAction implements Action {
  readonly type = SELECT_DATABASE_PAGE_ACTION;
  constructor(public payload: any) {}
}
export const FILTER_DATABASE_FILES_PAGE_ACTION =
  '[Database Page] filter database files';
export class FilterDatabaseFilesPageAction implements Action {
  readonly type = FILTER_DATABASE_FILES_PAGE_ACTION;
  constructor(public payload: string) {}
}

export const DATABASE_NOTHING_ACTION = '[Database] nothing';

export class DatabaseNothingAction implements Action {
  readonly type = DATABASE_NOTHING_ACTION;
}

export type DatabaseActions =
  | RepositoriesUpdatedEffectAction
  | InitializeDatabasePageAction
  | ServiceInitializeDatabaseCompleteAction
  | ServiceInitializeDatabaseFailedAction
  | CreateNewVersionPageAction
  | ServiceCreateNewVersionCompleteAction
  | ServiceCreateNewVersionFailedAction
  | PrepareUpdateObjectPageAction
  | ServicePrepareUpdateObjectCompleteAction
  | ServicePrepareUpdateObjectFailedAction
  | SelecteDatabasePageAction
  | FilterDatabaseFilesPageAction
  | DatabaseNothingAction;
