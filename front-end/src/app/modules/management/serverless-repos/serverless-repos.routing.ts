import { RouterModule, Routes } from '@angular/router';
import { ModuleWithProviders } from '@angular/core';
import { ServerlessReposComponent } from './serverless-repos.component';
import { ServerlessRepoComponent } from './serverless-repo/serverless-repo.component';

const routes: Routes = [
    {
        path: '',
        component: ServerlessReposComponent,
        children: [
            {
                path: ':code',
                component: ServerlessRepoComponent
            },
        ]
    }
];
export const serverlessReposRouting: ModuleWithProviders = RouterModule.forChild(routes);
