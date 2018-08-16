import { LocalhostService } from './localhost.service';
import { ManagementSetting } from '../models/management-settings.model';
import { Injectable } from '@angular/core';
import * as fromManagement from '../store/reducers/management.reducers';
import * as ManagementActions from '../store/actions/management.actions';
import { Store } from '@ngrx/store';
import { RepositoryFile } from '../models/database.model';

@Injectable()
export class ManagementService {
    constructor(
        private localhostService: LocalhostService,
        private store: Store<fromManagement.State>
    ) {
        setTimeout(() => {
            this.store.dispatch(new ManagementActions.GetEnvironmentsInitAction());
        }, 200);
        this.localhostService.hookManagementCallback('run discovery progress', (data) => {
            this.store.dispatch(new ManagementActions.ServiceRunRepoDiscoveryProgressAction(data));
        });
        this.localhostService.hookManagementCallback('run discovery failed', (data) => {
            this.store.dispatch(new ManagementActions.ServiceRunRepoDiscoveryFailedAction(data));
        });
        this.localhostService.hookManagementCallback('run discovery complete', (data) => {
            this.store.dispatch(new ManagementActions.ServiceRunRepoDiscoveryCompleteAction(data));
        });
    }

    static getErrorText(error: {
        code?: string,
        path?: string
    }): string {
        if (error.code && error.code === 'ENOENT') {
            return `A file could not be found. Please make sure the file is correctly mapped. File name :<br>${error.path}`;
        }
        console.log(error);
        return 'Unknown error';
    }

    getEnvironments(): Promise<{ environmentName: string }[]> {
        return <Promise<{ environmentName: string }[]>>this.localhostService.get('environments');
    }

    getSettings(): Promise<ManagementSetting[]> {
        // return Promise.resolve([]);
        return <Promise<ManagementSetting[]>>this.localhostService.get('settings');
    }

    getRepositoryData(): Promise<RepositoryFile[]> {
        // return Promise.resolve([]);
        return <Promise<RepositoryFile[]>>this.localhostService.get('repositories');
    }

    updateSettings(data: ManagementSetting[]): Promise<ManagementSetting[]> {
        return <Promise<ManagementSetting[]>>this.localhostService.post('settings/update', data);
    }

    runRepoDiscovery(): Promise<any> {
        return new Promise((resolve) => {
            this.localhostService.socketEmit('run discovery', null);
            resolve();
        })
    }
}