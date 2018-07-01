import { AppState } from './app.reducers';
import * as DatabaseActions from '../actions/database.actions';

export interface FeatureState extends AppState {
  databases: State;
}

export interface State {
  initializingDatabase: boolean;
  creatingNewVersion: boolean;
}

export const initialState: State = {
  initializingDatabase: false,
  creatingNewVersion: false,
};

export function databaseReducers(state = initialState, action: DatabaseActions.DatabaseActions) {
  switch (action.type) {
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
    default:
      return state;
  }
}
