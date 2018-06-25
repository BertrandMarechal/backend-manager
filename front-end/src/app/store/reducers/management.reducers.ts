import {AppState} from "./app.reducers";
import * as ManagementActions from '../actions/management.actions';
import { ManagementSetting } from "../../models/management-settings.model";

export interface FeatureState extends AppState {
  management: State;
}

export interface State {
    settings: ManagementSetting[],
    oldSettings: ManagementSetting[],
    gettingSettings: boolean,
    updatingSettings: boolean
}

export const initialState: State = {
    settings: null,
    oldSettings: null,
    gettingSettings: false,
    updatingSettings: false
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
    default:
      return state;
  }
}
