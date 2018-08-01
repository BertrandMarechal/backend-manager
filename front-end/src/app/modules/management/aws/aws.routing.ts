import { RouterModule, Routes } from '@angular/router';
import { ModuleWithProviders } from '@angular/core';
import { AwsComponent } from './aws.component';
import { LambdaFunctionsComponent } from './lambda-functions/lambda-functions.component';

const routes: Routes = [
    {
        path: '',
        component: AwsComponent,
        children: [
            {
                path: 'lambda-functions',
                component: LambdaFunctionsComponent
            },
        ]
    }
];
export const awsRouting: ModuleWithProviders = RouterModule.forChild(routes);
