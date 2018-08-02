import { AppState } from './app.reducers';
import * as AwsActions from '../actions/aws.actions';
import { Test } from '../../models/test.model';

export interface FeatureState extends AppState {
    aws: State;
}

export interface State {
    lambdaCallCount: number;
    testSet: Test[];
}
export const initialState: State = {
    lambdaCallCount: 0,
    testSet: [],
};

export function awsReducers(state = initialState, action: AwsActions.AwsActions) {
    switch (action.type) {
        case AwsActions.LAMBDA_SERVICE_FUNCTION_CALLED:
            return {
                ...state
            };
        case AwsActions.LAMBDA_SERVICE_FUNCTION_RESULT:
            return {
                ...state,
                lambdaCallCount: state.lambdaCallCount + 1,
                testSet: action.payload.testSet
            };
        case AwsActions.PAGE_NAVIGATE_TO_FUNCTIONS:
            return {
                ...state,
                lambdaCallCount: 0
            };
    }
    return state;
}
