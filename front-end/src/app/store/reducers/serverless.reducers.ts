import { AppState } from './app.reducers';
import * as ServerlessActions from '../actions/serverless.actions';
import { RepositoryFile } from '../../models/database.model';

export interface FeatureState extends AppState {
    serverless: State;
}

export interface State {
    serverlessRepos: RepositoryFile[];
    selectedServerlessRepo: RepositoryFile;
}
export const initialState: State = {
    serverlessRepos: [],
    selectedServerlessRepo: null,
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
    }
    return state;
}
