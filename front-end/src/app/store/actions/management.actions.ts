import { Action } from '@ngrx/store';
import { ManagementSetting } from '../../models/management-settings.model';

export const ROUTER_GET_SETTINGS =
    '[Settings router] get settings';
export const PAGE_REFRESH_SETTINGS =
    '[Settings page] refresh settings';
export const SERVICE_GET_SETTINGS_COMPLETE =
    '[Settings Service] get settings complete';
export const SERVICE_GET_SETTINGS_FAILED =
    '[Settings Service] get settings failed';
export class GetSettingsrouterAction implements Action {
  readonly type = ROUTER_GET_SETTINGS;
  constructor() {}
}
export class RefreshSettingsPageAction implements Action {
  readonly type = PAGE_REFRESH_SETTINGS;
  constructor() {}
}
export class ServiceGetSettingsCompleteAction implements Action {
  readonly type = SERVICE_GET_SETTINGS_COMPLETE;
  constructor(public payload: ManagementSetting[]) {}
}
export class ServiceGetSettingsFailedAction implements Action {
  readonly type = SERVICE_GET_SETTINGS_FAILED;
  constructor(public payload?: string) {}
}

export const PAGE_UPDATE_SETTINGS =
    '[Settings page] update settings';
export const SERVICE_UPDATE_SETTINGS_COMPLETE =
    '[Settings Service] update settings complete';
export const SERVICE_UPDATE_SETTINGS_FAILED =
    '[Settings Service] update settings failed';
export class UpdateSettingsPageAction implements Action {
  readonly type = PAGE_UPDATE_SETTINGS;
  constructor(public payload: ManagementSetting[]) {}
}
export class ServiceUpdateSettingsCompleteAction implements Action {
  readonly type = SERVICE_UPDATE_SETTINGS_COMPLETE;
  constructor(public payload: ManagementSetting[]) {}
}
export class ServiceUpdateSettingsFailedAction implements Action {
  readonly type = SERVICE_UPDATE_SETTINGS_FAILED;
  constructor(public payload?: string) {}
}

export const PAGE_RUN_REPO_DISCOVERY =
    '[Repository page] update settings';
export const SERVICE_REPO_DISCOVERY_PROGRESS =
    '[Repository Service] run repo discovery progress';
export const SERVICE_REPO_DISCOVERY_COMPLETE =
    '[Repository Service] run repo discovery complete';
export const SERVICE_REPO_DISCOVERY_FAILED =
    '[Repository Service] run repo discovery failed';

export class RunRepoDiscoveryPageAction implements Action {
  readonly type = PAGE_RUN_REPO_DISCOVERY;
  constructor() {}
}
export class ServiceRunRepoDiscoveryProgressAction implements Action {
  readonly type = SERVICE_REPO_DISCOVERY_PROGRESS;
  constructor(public payload: {completion: number, stepName: string}) {}
}
export class ServiceRunRepoDiscoveryCompleteAction implements Action {
  readonly type = SERVICE_REPO_DISCOVERY_COMPLETE;
  constructor(public payload: any) {}
}
export class ServiceRunRepoDiscoveryFailedAction implements Action {
  readonly type = SERVICE_REPO_DISCOVERY_FAILED;
  constructor(public payload?: string) {}
}

export const MANAGEMENT_SERVER_CONNECTED =
  '[Management] server connected';
export class ManagementServerConnectedAction implements Action {
  readonly type = MANAGEMENT_SERVER_CONNECTED;
}
export const MANAGEMENT_SERVER_DISCONNECTED =
  '[Management] server disconnected';
export class ManagementServerDisconnectedAction implements Action {
  readonly type = MANAGEMENT_SERVER_DISCONNECTED;
}

export const MANAGEMENT_NOTHING =
    '[Management] nothing';
  export class ManagementNothingAction implements Action {
    readonly type = MANAGEMENT_NOTHING;
  }

export type ManagementActions =
  | GetSettingsrouterAction
  | RefreshSettingsPageAction
  | ServiceGetSettingsCompleteAction
  | ServiceGetSettingsFailedAction
  | UpdateSettingsPageAction
  | ServiceUpdateSettingsCompleteAction
  | ServiceUpdateSettingsFailedAction
  | RunRepoDiscoveryPageAction
  | ServiceRunRepoDiscoveryProgressAction
  | ServiceRunRepoDiscoveryCompleteAction
  | ServiceRunRepoDiscoveryFailedAction
  | ManagementServerConnectedAction
  | ManagementServerDisconnectedAction
  | ManagementNothingAction;