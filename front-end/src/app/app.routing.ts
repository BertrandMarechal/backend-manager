import {RouterModule, Routes} from '@angular/router';
import {ModuleWithProviders} from '@angular/core';
import { ManagementComponent } from './modules/management/management.component';
import { SettingsComponent } from './modules/management/settings/settings.component';
import { SettingsEditComponent } from './modules/management/settings-edit/settings-edit.component';
import { HomeComponent } from './modules/management/home/home.component';
import { RepositoriesComponent } from './modules/management/repositories/repositories.component';
import { DatabasesComponent } from './modules/management/databases/databases.component';
import { DatabaseComponent } from './modules/management/databases/database/database.component';
import { InstallDatabasesComponent } from './modules/management/databases/install-databases/install-databases.component';
import { LogProgressComponent } from './modules/management/databases/install-databases/log-progress/log-progress.component';
import { ServerlessReposComponent } from './modules/management/serverless-repos/serverless-repos.component';
import { ServerlessRepoComponent } from './modules/management/serverless-repos/serverless-repo/serverless-repo.component';

const routes: Routes = [
  {
    path: 'management',
    component: ManagementComponent,
    children: [
      {
        path: '',
        component: HomeComponent
      },
      {
        path: 'repositories',
        component: RepositoriesComponent
      },
      {
        path: 'databases',
        loadChildren: './modules/management/databases/databases.module#DatabasesModule'
      },
      {
        path: 'aws',
        loadChildren: './modules/management/aws/aws.module#AwsModule'
      },
      {
        path: 'serverless-repos',
        loadChildren: './modules/management/serverless-repos/serverless-repos.module#ServerlessReposModule'
      },
      {
        path: 'settings',
        component: SettingsComponent
      },
      {
        path: 'settings/edit',
        component: SettingsEditComponent
      }
    ]
  },
  {
    path: '',
    redirectTo: '/management',
    pathMatch: 'full'
  }
];
export const appRouting: ModuleWithProviders = RouterModule.forRoot(routes);
