import { AppState } from './app.reducers';
import * as AwsActions from '../actions/aws.actions';

export interface FeatureState extends AppState {
    aws: State;
}

export interface State {
    somethingNew: boolean;
}
export const initialState: State = {
    somethingNew: false
};

export function awsReducers(state = initialState, action: AwsActions.AwsActions) {
    switch (action.type) {
        case AwsActions.LAMBDA_SERVICE_FUNCTION_CALLED:
            return {
                ...state,
                somethingNew: true
            };
        case AwsActions.LAMBDA_SERVICE_FUNCTION_RESULT:
            return {
                ...state,
                somethingNew: true
            };
        case AwsActions.PAGE_NAVIGATE_TO_FUNCTIONS:
            return {
                ...state,
                somethingNew: false
            };
    }
    return state;
}
