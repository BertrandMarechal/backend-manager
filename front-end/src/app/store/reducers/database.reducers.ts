import { AppState } from './app.reducers';
import * as DatabaseActions from '../actions/database.actions';
import { RepositoryFile } from '../../models/database.model';
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
};

export function databaseReducers(state = initialState, action: DatabaseActions.DatabaseActions) {

  switch (action.type) {
    case DatabaseActions.DATABASE_REPOSITORIES_UPDATED:
      let selectedDatabase: RepositoryFile = null;
      let canCreateNewVersion = false;
      let hasCurrentFolder = false;
      if (state.selectedDatabase) {
        selectedDatabase = (action.payload || [])
          .filter(x => x.isDatabase && x.name === state.selectedDatabase.name)[0];
        hasCurrentFolder = selectedDatabase.databases &&
          selectedDatabase.databases.filter(x => x.version === 'current').length > 0;
        canCreateNewVersion = selectedDatabase.databases &&
          selectedDatabase.databases.length > 0 &&
          !hasCurrentFolder;
      }
      return {
        ...state,
        databases: (action.payload || []).filter(x => x.isDatabase),
        selectedDatabase: selectedDatabase,
        canCreateNewVersion: canCreateNewVersion,
        hasCurrentFolder: hasCurrentFolder
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
        hasCurrentFolder: action.payload.databases &&
          action.payload.databases.filter(x => x.version === 'current').length > 0,
        canCreateNewVersion: action.payload.databases &&
          action.payload.databases.length > 0 &&
          action.payload.databases.filter(x => x.version === 'current').length === 0,
        ...DatabaseService.getDatabaseFileLists(action.payload),
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
    default:
      return state;
  }
}
