import { Action } from '@ngrx/store';
import { RepositoryFile } from '../../models/database.model';

export const SERVERLESS_REPOSITORIES_UPDATED = '[Serverless effect] Repositories updated';
export class RepositoriesUpdatedEffectAction implements Action {
  readonly type = SERVERLESS_REPOSITORIES_UPDATED;
  constructor(public payload?: RepositoryFile[]) { }
}

export const SELECT_SERVERLESS_PAGE_ACTION =
  '[Serverless Page] select serverless repo';
export class SelecteServerlessPageAction implements Action {
  readonly type = SELECT_SERVERLESS_PAGE_ACTION;
  constructor(public payload: RepositoryFile) { }
}
export const SERVERLESS_NOTHING_ACTION =
  '[Serverless] nothing';
export class ServerlessNothingAction implements Action {
  readonly type = SERVERLESS_NOTHING_ACTION;
}

export type ServerlessActions =
    | RepositoriesUpdatedEffectAction
    | SelecteServerlessPageAction
    | ServerlessNothingAction;
