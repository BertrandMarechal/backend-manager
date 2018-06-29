import {AppState} from './app.reducers';
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
    databases: RepositoryFile[];
    serverConnected: boolean;
    currentDiscoveryStep: { stepName: string, complete: boolean };
    environment: string;
    selectedDatabase: RepositoryFile;
    filteredDatabaseFiles: string[];
}

export const initialState: State = {
    settings: null,
    oldSettings: null,
    gettingSettings: false,
    updatingSettings: false,
    runDiscoveryProgress: null,
    repositories: null,
    databases: null,
    serverConnected: false,
    currentDiscoveryStep: null,
    environment: 'local',
    selectedDatabase: null,
    filteredDatabaseFiles: []
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
                { stepName: action.payload.stepName, complete: false}
            ]
        };
    case ManagementActions.SERVICE_REPO_DISCOVERY_COMPLETE:
    case ManagementActions.SERVICE_GET_REPOSITORY_DATA_COMPLETE:
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
            databases: (action.payload || []).filter(x => x.isDatabase)
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
    case ManagementActions.SELECT_ENVIRONMENT_PAGE_ACTION:
      return {
          ...state,
          environment: action.payload
      };
    case ManagementActions.SELECT_DATABASE_PAGE_ACTION:
      return {
          ...state,
          selectedDatabase: action.payload
      };
    case ManagementActions.FILTER_DATABASE_FILES_PAGE_ACTION:
        let files = [];
          if (state.selectedDatabase && action.payload) {
            files = state.selectedDatabase
                .databases
                .map(x => {
                    return x.databases.map(y => {
                        return y.databaseFiles
                            .map( z => z.filePath)
                            .reduce((a, c) => a.concat(c), []);
                    }).reduce((a, c) => a.concat(c), []);
                }).reduce((a, c) => a.concat(c), []);
            console.log(files);
            files = files
                .filter(x => x.indexOf('postgres/schema/') > -1)
                .filter(x => x.indexOf(action.payload) > -1);
        }

        return {
            ...state,
            filteredDatabaseFiles: files
        };
    default:
      return state;
  }
}
