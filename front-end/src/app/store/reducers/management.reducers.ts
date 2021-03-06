import { AppState } from './app.reducers';
import * as ManagementActions from '../actions/management.actions';
import { ManagementSetting } from '../../models/management-settings.model';
import { RepositoryFile } from '../../models/database.model';

export interface FeatureState extends AppState {
    management: State;
}

export interface State {
    settings: ManagementSetting[];
    oldSettings: ManagementSetting[];
    gettingSettings: boolean;
    updatingSettings: boolean;
    runDiscoveryProgress: { stepName: string, complete: boolean }[];
    repositories: RepositoryFile[];
    serverConnected: boolean;
    lambdaServerConnected: boolean;
    currentDiscoveryStep: { stepName: string, complete: boolean };
    environment: string;
    environments: {environmentName: string}[];
    gettingEnvironments: boolean;
    hasDatabases: boolean;
    hasMiddleTiers: boolean;
}

export const initialState: State = {
    settings: null,
    oldSettings: null,
    gettingSettings: false,
    updatingSettings: false,
    runDiscoveryProgress: null,
    repositories: null,
    serverConnected: false,
    lambdaServerConnected: false,
    currentDiscoveryStep: null,
    environment: 'local',
    environments: [],
    gettingEnvironments: false,
    hasDatabases: false,
    hasMiddleTiers: false,
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
        case ManagementActions.GET_ENVIRONMENTS_INIT:
            return {
                ...state,
                gettingEnvironments: true
            };
        case ManagementActions.SERVICE_GET_ENVIRONMENTS_COMPLETE:
            return {
                ...state,
                gettingEnvironments: false,
                environments: action.payload
            };
        case ManagementActions.SERVICE_GET_ENVIRONMENTS_FAILED:
            return {
                ...state,
                gettingEnvironments: false
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
        case ManagementActions.ROUTER_GET_REPOSITORY_DATA:
            return {
                ...state,
                runDiscoveryProgress: [],
                repositories: null,
                databases: null,
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
                    { stepName: action.payload.stepName, complete: false }
                ]
            };
        case ManagementActions.SERVICE_REPO_DISCOVERY_COMPLETE:
        case ManagementActions.SERVICE_GET_REPOSITORY_DATA_COMPLETE:
            const databases = (action.payload || []) .filter(x => x.isDatabase);
            const middleTiers = (action.payload || []) .filter(x => x.isMiddleTier);
            const hasDatabases = databases.length > 0;
            const hasMiddleTiers = middleTiers.length > 0;
            return {
                ...state,
                currentDiscoveryStep: null,
                runDiscoveryProgress: state.runDiscoveryProgress.map(x => {
                    return {
                        ...x,
                        complete: true
                    };
                }),
                repositories: action.payload || [],
                hasDatabases: hasDatabases,
                hasMiddleTiers: hasMiddleTiers,
            };
        case ManagementActions.SERVICE_REPO_DISCOVERY_FAILED:
            return {
                ...state,
                currentDiscoveryStep: null
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
        case ManagementActions.MANAGEMENT_LAMBDA_SERVER_CONNECTED:
            return {
                ...state,
                lambdaServerConnected: true
            };
        case ManagementActions.MANAGEMENT_LAMBDA_SERVER_DISCONNECTED:
            return {
                ...state,
                lambdaServerConnected: false
            };
        case ManagementActions.SELECT_ENVIRONMENT_PAGE_ACTION:
            return {
                ...state,
                environment: action.payload
            };
        default:
            return state;
    }
}
