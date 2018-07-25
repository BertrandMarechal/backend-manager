import { Action } from '@ngrx/store';
import { RepositoryFile } from '../../models/database.model';

export const SERVERLESS_REPOSITORIES_UPDATED = '[Serverless effect] Repositories updated';
export class RepositoriesUpdatedEffectAction implements Action {
  readonly type = SERVERLESS_REPOSITORIES_UPDATED;
  constructor(public payload?: RepositoryFile[]) { }
}

export const SELECT_SERVERLESS_PAGE_ACTION =
  '[Serverless Page] select serverless repo';
export class SelecteServerlessPageAction implements Action {
  readonly type = SELECT_SERVERLESS_PAGE_ACTION;
  constructor(public payload: RepositoryFile) { }
}

export const SAVE_SERVERLESS_SETTING_PAGE = '[Serverless Page] SAVE_SERVERLESS_SETTING';
export const SERVICE_SAVE_SERVERLESS_SETTING_COMPLETE = '[Serverless Service] SAVE_SERVERLESS_SETTING complete';
export const SERVICE_SAVE_SERVERLESS_SETTING_FAILED = '[Serverless Service] SAVE_SERVERLESS_SETTING failed';
export const SERVICE_SAVE_SERVERLESS_SETTING_UPDATING_WIPE = '[Serverless Service] SAVE_SERVERLESS_SETTING_UPDATING wipe';

export class SaveServerlessSettingPageAction implements Action {
  readonly type = SAVE_SERVERLESS_SETTING_PAGE;
  constructor(public payload?: { settingName: string, serviceName: string, settingValue: string, environment: string }) { }
}
export class ServiceSaveServerlessSettingCompleteAction implements Action {
  readonly type = SERVICE_SAVE_SERVERLESS_SETTING_COMPLETE;
  constructor(public payload?: any) { }
}
export class ServiceSaveServerlessSettingFailedAction implements Action {
  readonly type = SERVICE_SAVE_SERVERLESS_SETTING_FAILED;
  constructor(public payload?: string) { }
}
export class ServiceSaveServerlessSettingUpdatingWipeAction implements Action {
  readonly type = SERVICE_SAVE_SERVERLESS_SETTING_UPDATING_WIPE;
  constructor(public payload?: { settingName: string, settingValue: string, environment: string }) { }
}


export const SERVERLESS_NOTHING_ACTION =
  '[Serverless] nothing';
export class ServerlessNothingAction implements Action {
  readonly type = SERVERLESS_NOTHING_ACTION;
}

export type ServerlessActions =
    | RepositoriesUpdatedEffectAction
    | SelecteServerlessPageAction
    | SaveServerlessSettingPageAction
    | ServiceSaveServerlessSettingCompleteAction
    | ServiceSaveServerlessSettingFailedAction
    | ServiceSaveServerlessSettingUpdatingWipeAction
    | ServerlessNothingAction;
