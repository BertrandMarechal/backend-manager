import { Action } from '@ngrx/store';
import { RepositoryFile, DatabaseInstallationProgress } from '../../models/database.model';

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
  readonly type = PREPARE_UPDATE_OBJECT_PAGE_ACTION;
  constructor(public payload?: { repoName: string, fileName: string, mode: string }) { }
}
export class ServicePrepareUpdateObjectCompleteAction implements Action {
  readonly type = SERVICE_PREPARE_UPDATE_OBJECT_COMPLETE;
  constructor(public payload?: any) { }
}
export class ServicePrepareUpdateObjectFailedAction implements Action {
  readonly type = SERVICE_PREPARE_UPDATE_OBJECT_FAILED;
  constructor(public payload?: string) { }
}

export const SET_VERSION_AS_INSTALLED_PAGE_ACTION = '[Database Page] SET_VERSION_AS_INSTALLED';
export const SERVICE_SET_VERSION_AS_INSTALLED_COMPLETE = '[Database Service] SET_VERSION_AS_INSTALLED complete';
export const SERVICE_SET_VERSION_AS_INSTALLED_FAILED = '[Database Service] SET_VERSION_AS_INSTALLED failed';

export class SetVersionAsInstalledPageAction implements Action {
  readonly type = SET_VERSION_AS_INSTALLED_PAGE_ACTION;
  constructor(public payload?: { versionName: string }) { }
}
export class ServiceSetVersionAsInstalledCompleteAction implements Action {
  readonly type = SERVICE_SET_VERSION_AS_INSTALLED_COMPLETE;
  constructor(public payload?: any) { }
}
export class ServiceSetVersionAsInstalledFailedAction implements Action {
  readonly type = SERVICE_SET_VERSION_AS_INSTALLED_FAILED;
  constructor(public payload?: string) { }
}

export const SELECT_DATABASE_PAGE_ACTION =
  '[Databases Page] select database';
export class SelecteDatabasePageAction implements Action {
  readonly type = SELECT_DATABASE_PAGE_ACTION;
  constructor(public payload: any) { }
}
export const FILTER_DATABASE_FILES_PAGE_ACTION =
  '[Database Page] filter database files';
export class FilterDatabaseFilesPageAction implements Action {
  readonly type = FILTER_DATABASE_FILES_PAGE_ACTION;
  constructor(public payload: string) { }
}

export const SAVE_SETTING_PAGE = '[Database Page] SAVE_SETTING';
export const SERVICE_SAVE_SETTING_COMPLETE = '[Database Service] SAVE_SETTING complete';
export const SERVICE_SAVE_SETTING_FAILED = '[Database Service] SAVE_SETTING failed';
export const SERVICE_SAVE_SETTING_UPDATING_WIPE = '[Database Service] SAVE_SETTING_UPDATING wipe';

export class SaveSettingPageAction implements Action {
  readonly type = SAVE_SETTING_PAGE;
  constructor(public payload?: { settingName: string, settingValue: string, environment: string }) { }
}
export class ServiceSaveSettingCompleteAction implements Action {
  readonly type = SERVICE_SAVE_SETTING_COMPLETE;
  constructor(public payload?: any) { }
}
export class ServiceSaveSettingFailedAction implements Action {
  readonly type = SERVICE_SAVE_SETTING_FAILED;
  constructor(public payload?: string) { }
}
export class ServiceSaveSettingUpdatingWipeAction implements Action {
  readonly type = SERVICE_SAVE_SETTING_UPDATING_WIPE;
  constructor(public payload?: { settingName: string, settingValue: string, environment: string }) { }
}

export const INSTALL_DATABASES_PAGE_ACTION = '[Database Install Page] INSTALL_DATABASES';
export const SERVICE_INSTALL_DATABASES_PROGRESS = '[Database Install Service] INSTALL_DATABASES progress';
export const SERVICE_INSTALL_DATABASES_COMPLETE = '[Database Install Service] INSTALL_DATABASES complete';
export const SERVICE_INSTALL_DATABASES_FAILED = '[Database Install Service] INSTALL_DATABASES failed';

export class InstallDatabasePageAction implements Action {
  readonly type = INSTALL_DATABASES_PAGE_ACTION;
  constructor(public payload?: { repoName: string, version?: string, user?: string, fileName?: string }) { }
}
export class ServiceInstallDatabaseProgressAction implements Action {
  readonly type = SERVICE_INSTALL_DATABASES_COMPLETE;
  constructor(public payload: DatabaseInstallationProgress[]) { }
}
export class ServiceInstallDatabaseCompleteAction implements Action {
  readonly type = SERVICE_INSTALL_DATABASES_PROGRESS;
  constructor(public payload: DatabaseInstallationProgress[]) { }
}
export class ServiceInstallDatabaseFailedAction implements Action {
  readonly type = SERVICE_INSTALL_DATABASES_FAILED;
  constructor(public payload?: string) { }
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
  | SetVersionAsInstalledPageAction
  | ServiceSetVersionAsInstalledCompleteAction
  | ServiceSetVersionAsInstalledFailedAction
  | SelecteDatabasePageAction
  | FilterDatabaseFilesPageAction
  | SaveSettingPageAction
  | ServiceSaveSettingCompleteAction
  | ServiceSaveSettingFailedAction
  | ServiceSaveSettingUpdatingWipeAction
  | InstallDatabasePageAction
  | ServiceInstallDatabaseProgressAction
  | ServiceInstallDatabaseCompleteAction
  | ServiceInstallDatabaseFailedAction
  | DatabaseNothingAction;
