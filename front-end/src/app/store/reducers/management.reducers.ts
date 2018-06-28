import {AppState} from './app.reducers';
import * as ManagementActions from '../actions/management.actions';
import { ManagementSetting } from '../../models/management-settings.model';

export interface FeatureState extends AppState {
  management: State;
}

export interface State {
    settings: ManagementSetting[];
    oldSettings: ManagementSetting[];
    gettingSettings: boolean;
    updatingSettings: boolean;
    runDiscoveryProgress: {stepName: string, complete: boolean}[];
    repositories: any;
    serverConnected: boolean;
    currentDiscoveryStep: { stepName: string, complete: boolean };
}

export const initialState: State = {
    settings: null,
    oldSettings: null,
    gettingSettings: false,
    updatingSettings: false,
    runDiscoveryProgress: null,
    repositories: null,
    serverConnected: false,
    currentDiscoveryStep: null
};

export function managementeReducers(state = initialState, action: ManagementActions.ManagementActions) {
  switch (action.type) {
    case ManagementActions.ROUTER_GET_SETTINGS:
    case ManagementActions.PAGE_REFRESH_SETTINGS:
        return {
            ...state,
            gettingSettings: true
        };
    case ManagementActions.SERVICE_GET_SETTINGS_COMPLETE:
        return {
            ...state,
            gettingSettings: false,
            settings: action.payload
        };
    case ManagementActions.SERVICE_GET_SETTINGS_FAILED:
        return {
            ...state,
            gettingSettings: false
        };
    case ManagementActions.PAGE_UPDATE_SETTINGS:
        return {
            ...state,
            oldSettings: state.settings,
            settings: state.settings.map(x => {
                return action.payload.find(y => y.id === x.id) || x;
            }),
            updatingSettings: true
        };
    case ManagementActions.SERVICE_UPDATE_SETTINGS_COMPLETE:
        return {
            ...state,
            updatingSettings: false,
            settings: action.payload
        };
    case ManagementActions.SERVICE_UPDATE_SETTINGS_FAILED:
        return {
            ...state,
            updatingSettings: false,
            settings: state.oldSettings
        };
    case ManagementActions.PAGE_RUN_REPO_DISCOVERY:
        return {
            ...state,
            runDiscoveryProgress: [],
            repositories: null,
        };
    case ManagementActions.SERVICE_REPO_DISCOVERY_PROGRESS:
        return {
            ...state,
            currentDiscoveryStep: action.payload,
            runDiscoveryProgress: [
                ...state.runDiscoveryProgress.map(x => {
                    return {
                        ...x,
                        complete: true
                    };
                }),
                { stepName: action.payload.stepName, complete: false}
            ]
        };
    case ManagementActions.SERVICE_REPO_DISCOVERY_COMPLETE:
        console.log(action.payload);
        return {
            ...state,
            currentDiscoveryStep: null,
            runDiscoveryProgress: state.runDiscoveryProgress.map(x => {
                    return {
                        ...x,
                        complete: true
                    };
                }),
            repositories: action.payload
        };
    case ManagementActions.MANAGEMENT_SERVER_CONNECTED:
      return {
          ...state,
          serverConnected: true
      };
      case ManagementActions.MANAGEMENT_SERVER_DISCONNECTED:
        return {
            ...state,
            serverConnected: false
        };
    default:
      return state;
  }
}
