import { Action } from '@ngrx/store';

export const ROUTER_GET_DATABASES = '[Database router] get databases';
export const PAGE_REFRESH_DATABASES = '[Database page] refresh databases';
export const SERVICE_GET_DATABASES_COMPLETE =
  '[Database Service] get databases complete';
export const SERVICE_GET_DATABASES_FAILED =
  '[Database Service] get databases failed';
export class GetDatabasesrouterAction implements Action {
  readonly type = ROUTER_GET_DATABASES;
  constructor(public payload?: any) {}
}
export class RefreshDatabasesPageAction implements Action {
  readonly type = PAGE_REFRESH_DATABASES;
  constructor(public payload?: any) {}
}
export class ServiceGetDatabasesCompleteAction implements Action {
  readonly type = SERVICE_GET_DATABASES_COMPLETE;
  constructor(public payload?: any) {}
}
export class ServiceGetDatabasesFailedAction implements Action {
  readonly type = SERVICE_GET_DATABASES_FAILED;
  constructor(public payload?: string) {}
}

export const ROUTER_GET_DATABASE = '[Database Router] get database';
export const PAGE_REFRESH_DATABASE = '[Database Page] refresh database';
export const SERVICE_GET_DATABASE_COMPLETE = '[Database Service] get database complete';
export const SERVICE_GET_DATABASE_FAILED = '[Database Service] get database failed';
export class GetDatabaseRouterAction implements Action {
  readonly type  = ROUTER_GET_DATABASE;
  constructor(public payload?: string) {}
}
export class RefreshDatabasePageAction implements Action {
  readonly type  = PAGE_REFRESH_DATABASE;
  constructor(public payload?: string) {}
}
export class ServiceGetDatabaseCompleteAction implements Action {
  readonly type  = SERVICE_GET_DATABASE_COMPLETE;
  constructor(public payload?: any) {}
}
export class ServiceGetDatabaseFailedAction implements Action {
  readonly type  = SERVICE_GET_DATABASE_FAILED;
  constructor(public payload?: string) {}
}

export const PAGE_INSTALL_DATABASE_VERSIONS = '[Database Page] install database versions';
export const SERVICE_INSTALL_DATABASE_VERSIONS_PROGRESS = '[Database Service] install database versions progress';
export const SERVICE_INSTALL_DATABASE_VERSIONS_COMPLETE = '[Database Service] install database versions complete';
export const SERVICE_INSTALL_DATABASE_VERSIONS_FAILED = '[Database Service] install database versions failed';
export class InstallDatabaseVersionsPageAction implements Action {
  readonly type  = PAGE_INSTALL_DATABASE_VERSIONS;
  constructor(public payload?: any) {}
}
export class ServiceInstallDatabaseVersionsCompleteAction implements Action {
  readonly type  = SERVICE_INSTALL_DATABASE_VERSIONS_COMPLETE;
  constructor(public payload?: any) {}
}
export class ServiceInstallDatabaseVersionsProgressAction implements Action {
  readonly type  = SERVICE_INSTALL_DATABASE_VERSIONS_PROGRESS;
  constructor(public payload?: any) {}
}
export class ServiceInstallDatabaseVersionsFailedAction implements Action {
  readonly type  = SERVICE_INSTALL_DATABASE_VERSIONS_FAILED;
  constructor(public payload?: string) {}
}

export type DatabaseActions =
  | GetDatabasesrouterAction
  | RefreshDatabasesPageAction
  | ServiceGetDatabasesCompleteAction
  | ServiceGetDatabasesFailedAction

  | GetDatabaseRouterAction
  | RefreshDatabasePageAction
  | ServiceGetDatabaseCompleteAction
  | ServiceGetDatabaseFailedAction

  | InstallDatabaseVersionsPageAction
  | ServiceInstallDatabaseVersionsProgressAction
  | ServiceInstallDatabaseVersionsCompleteAction
  | ServiceInstallDatabaseVersionsFailedAction;
