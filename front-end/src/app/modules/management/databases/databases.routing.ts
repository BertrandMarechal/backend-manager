import { RouterModule, Routes } from '@angular/router';
import { ModuleWithProviders } from '@angular/core';
import { DatabasesComponent } from './databases.component';
import { DatabaseComponent } from './database/database.component';
import { InstallDatabasesComponent } from './install-databases/install-databases.component';
import { LogProgressComponent } from './install-databases/log-progress/log-progress.component';

const routes: Routes = [
    {
        path: '',
        component: DatabasesComponent,
        children: [
            {
                path: 'install',
                component: InstallDatabasesComponent
            },
            {
                path: 'install/log-progress',
                component: LogProgressComponent
            },
            {
                path: ':code',
                component: DatabaseComponent
            },
        ]
    }
];
export const databasesRouting: ModuleWithProviders = RouterModule.forChild(routes);
