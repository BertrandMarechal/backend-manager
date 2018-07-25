import { AppState } from './app.reducers';
import * as ServerlessActions from '../actions/serverless.actions';
import { RepositoryFile } from '../../models/database.model';
import {Map, Record} from 'immutable';

export interface FeatureState extends AppState {
    serverless: State;
}

export interface State {
    serverlessRepos: RepositoryFile[];
    selectedServerlessRepo: RepositoryFile;
    updatingSettings: {[name: string]: boolean};
    currentUpdatingSettings: { settingName: string, serviceName: string, settingValue: string, environment: string };
}
export const initialState: State = {
    serverlessRepos: [],
    selectedServerlessRepo: null,
    updatingSettings: {},
    currentUpdatingSettings: null
};

export function serverlessReducers(state = initialState, action: ServerlessActions.ServerlessActions) {
    switch (action.type) {
        case ServerlessActions.SERVERLESS_REPOSITORIES_UPDATED:
            let selectedServerlessRepo: RepositoryFile = null;
            if (state.selectedServerlessRepo) {
                selectedServerlessRepo = (action.payload || [])
                    .filter(x => x.isMiddleTier && x.name === state.selectedServerlessRepo.name)[0];
            }
            return {
                ...state,
                serverlessRepos: (action.payload || []).filter(x => x.isMiddleTier),
                selectedServerlessRepo: selectedServerlessRepo,
            };
        case ServerlessActions.SELECT_SERVERLESS_PAGE_ACTION:
            return {
                ...state,
                selectedServerlessRepo: state.serverlessRepos.find(x => x.name === action.payload.name)
            };
        case ServerlessActions.SAVE_SERVERLESS_SETTING_PAGE:
            return {
                ...state,
                updatingSettings: {
                    ...state.updatingSettings,
                    [action.payload.serviceName + '-' + action.payload.settingName]: false
                },
                currentUpdatingSettings: action.payload
            };
        case ServerlessActions.SERVICE_SAVE_SERVERLESS_SETTING_COMPLETE:
            return {
                ...state,
                updatingSettings: {
                    ...state.updatingSettings,
                    [state.currentUpdatingSettings.serviceName + '-' + state.currentUpdatingSettings.settingName]: true
                },
                currentUpdatingSettings: null
            };
        case ServerlessActions.SERVICE_SAVE_SERVERLESS_SETTING_UPDATING_WIPE:
            const updatingSettings = Object.keys(state.updatingSettings).filter(x => !state.updatingSettings[x]).reduce((agg, current) => {
                return {
                    ...agg,
                    [current]: false
                };
            }, {});
            return {
                ...state,
                updatingSettings: updatingSettings
            };
    }
    return state;
}
