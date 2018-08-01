import { Action } from '@ngrx/store';

export const PAGE_NAVIGATE_TO_FUNCTIONS = '[Management page] navigate to functions';
export class PageNavigateToFunctions implements Action {
  readonly type = PAGE_NAVIGATE_TO_FUNCTIONS;
}
export const LAMBDA_SERVICE_FUNCTION_CALLED = '[Lambda service] function called';
export class LambdaServiceFunctionCalled implements Action {
  readonly type = LAMBDA_SERVICE_FUNCTION_CALLED;
  constructor(payload: {serviceName: string, functionName: string, payload: any}) {}
}
export const LAMBDA_SERVICE_FUNCTION_RESULT = '[Lambda service] function result';
export class LambdaServiceFunctionResult implements Action {
  readonly type = LAMBDA_SERVICE_FUNCTION_RESULT;
  constructor(payload: {serviceName: string, functionName: string, payload: any, resut: any}) {}
}
export const AWS_NOTHING = '[AWS] nothing';
export class AwsNothing implements Action {
  readonly type = AWS_NOTHING;
}


export type AwsActions =
    | PageNavigateToFunctions
    | LambdaServiceFunctionCalled
    | LambdaServiceFunctionResult
    | AwsNothing;
