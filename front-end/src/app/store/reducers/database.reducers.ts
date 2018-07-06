import { AppState } from './app.reducers';
import * as DatabaseActions from '../actions/database.actions';
import { RepositoryFile, DatabaseInformation, DatabaseInstallationProgress } from '../../models/database.model';
import { DatabaseService } from '../../services/database.service';

export interface FeatureState extends AppState {
  databaseManagement: State;
}

export interface State {
  databases: RepositoryFile[];
  initializingDatabase: boolean;
  creatingNewVersion: boolean;
  selectedDatabase: RepositoryFile;
  filteredDatabaseFiles: string[];
  canCreateNewVersion: boolean;
  hasCurrentFolder: boolean;
  functionFileList: string[];
  tableFileList: string[];

  selectedDatabaseInformation: DatabaseInformation;
  updatingSetting: { settingName: string, settingValue: string, environment: string, done: boolean };

  installingDatabases: boolean;
  installationProgress: number;
  installationProgressArray: DatabaseInstallationProgress[];
}

export const initialState: State = {
  databases: null,
  initializingDatabase: false,
  creatingNewVersion: false,
  selectedDatabase: null,
  filteredDatabaseFiles: [],
  canCreateNewVersion: false,
  hasCurrentFolder: false,
  functionFileList: [],
  tableFileList: [],
  selectedDatabaseInformation: new DatabaseInformation(),
  updatingSetting: null,
  installingDatabases: false,
  installationProgress: 0,
  installationProgressArray: null,
};

export function databaseReducers(state = initialState, action: DatabaseActions.DatabaseActions) {
  switch (action.type) {
    case DatabaseActions.DATABASE_REPOSITORIES_UPDATED:
      let selectedDatabase: RepositoryFile = null;
      if (state.selectedDatabase) {
        selectedDatabase = (action.payload || [])
          .filter(x => x.isDatabase && x.name === state.selectedDatabase.name)[0];
      }
      return {
        ...state,
        databases: (action.payload || []).filter(x => x.isDatabase),
        selectedDatabase: selectedDatabase,
        selectedDatabaseInformation: state.selectedDatabaseInformation.processDatabaseData(selectedDatabase)
      };
    case DatabaseActions.INITIALIZE_DATABASE_PAGE:
      return {
        ...state,
        initializingDatabase: true
      };
    case DatabaseActions.SERVICE_INITIALIZE_DATABASE_COMPLETE:
    case DatabaseActions.SERVICE_INITIALIZE_DATABASE_FAILED:
      return {
        ...state,
        initializingDatabase: false
      };
    case DatabaseActions.CREATE_NEW_VERSION_PAGE:
      return {
        ...state,
        creatingNewVersion: true
      };
    case DatabaseActions.SERVICE_CREATE_NEW_VERSION_COMPLETE:
    case DatabaseActions.SERVICE_CREATE_NEW_VERSION_FAILED:
      return {
        ...state,
        creatingNewVersion: false
      };
    case DatabaseActions.SELECT_DATABASE_PAGE_ACTION:
      return {
        ...state,
        selectedDatabase: action.payload,
        selectedDatabaseInformation: state.selectedDatabaseInformation.processDatabaseData(action.payload)
      };
    case DatabaseActions.FILTER_DATABASE_FILES_PAGE_ACTION:
      let files = [];
      if (state.selectedDatabase && action.payload) {
        files = state.selectedDatabase
          .databases
          .map(x => {
            return x.databases.map(y => {
              return y.databaseFiles
                .map(z => z.filePath)
                .reduce((a, c) => a.concat(c), []);
            }).reduce((a, c) => a.concat(c), []);
          }).reduce((a, c) => a.concat(c), []);
        files = files
          .filter(x => x.indexOf('postgres/schema/') > -1)
          .filter(x => x.indexOf(action.payload) > -1);
      }
      return {
        ...state,
        filteredDatabaseFiles: files
      };
    case DatabaseActions.SAVE_SETTING_PAGE:
      return {
        ...state,
        updatingSetting: {
          ...action.payload,
          done: false
        }
      };
    case DatabaseActions.SERVICE_SAVE_SETTING_COMPLETE:
      const newState = {
        ...state,
        updatingSetting: {
          ...state.updatingSetting,
          done: true
        },
        selectedDatabase: {
          ...state.selectedDatabase,
          parameters: {
            ...state.selectedDatabase.parameters,
            [action.payload.data.environment]: [
              ...state.selectedDatabase.parameters[action.payload.data.environment]
                .map(x => {
                  if (x.name === action.payload.data.settingName) {
                    return {
                      ...x,
                      value: action.payload.data.settingValue
                    };
                  } else {
                    return x;
                  }
                })
            ]
          }
        }
      };
      return newState;
    case DatabaseActions.SERVICE_SAVE_SETTING_FAILED:
    case DatabaseActions.SERVICE_SAVE_SETTING_UPDATING_WIPE:
      return {
        ...state,
        updatingSetting: null
      };
    case DatabaseActions.INSTALL_DATABASES_PAGE_ACTION:
      return {
        ...state,
        installingDatabases: true,
        installationProgress: 0,
        installationProgressArray: []
      };
    case DatabaseActions.SERVICE_INSTALL_DATABASES_PROGRESS:
      let sidpProgressArray: DatabaseInstallationProgress[] = [];
      let totalSidbProgress = 0;
      if (action.payload) {
        sidpProgressArray = action.payload
          .map(x => new DatabaseInstallationProgress(x));
        totalSidbProgress = sidpProgressArray.reduce((current, x) => {
          current.total += 100;
          current.done += x.progress || 0;
          current.progress = (current.done > 0 ? Math.floor(100 * current.done / current.total) : 0);
          return current;
        }, { total: 0, done: 0, progress: 0 }).progress;
        return {
          ...state,
          installingDatabases: true,
          installationProgressArray: sidpProgressArray,
          installationProgress: totalSidbProgress
        };
      }
      return {
        ...state
      };
    case DatabaseActions.SERVICE_INSTALL_DATABASES_COMPLETE:
      const sidcProgressArray: DatabaseInstallationProgress[] = action.payload
        .map(x => new DatabaseInstallationProgress(x));
      return {
        ...state,
        installingDatabases: false,
        installationProgressArray: sidcProgressArray,
        installationProgress: 100
      };
    case DatabaseActions.SERVICE_INSTALL_DATABASES_FAILED:
      return {
        ...state,
        installingDatabases: false
      };
    default:
      return state;
  }
}
