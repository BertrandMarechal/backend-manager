import { LocalhostService } from './localhost.service';
import { ManagementSetting } from '../models/management-settings.model';
import { Injectable } from '@angular/core';
import * as fromManagement from '../store/reducers/management.reducers';
import * as fromDatabase from '../store/reducers/database.reducers';
import * as DatabaseActions from '../store/actions/database.actions';
import * as ManagementActions from '../store/actions/management.actions';
import { Store } from '@ngrx/store';
import { RepositoryFile } from '../models/database.model';

@Injectable()
export class DatabaseService {
    constructor(
        private localhostService: LocalhostService,
        private store: Store<fromDatabase.State>,
        private storeManagement: Store<fromManagement.State>
    ) {

    }

    initializeDatabase(params: { repoName: string, dbAlias: string }): Promise<any> {
        return new Promise((resolve) => {
            this.localhostService.hookCallback('initialize database failed', (data) => {
                this.store.dispatch(new DatabaseActions.ServiceInitializeDatabaseFailedAction(data));
            });
            this.localhostService.hookCallback('run discovery complete', (data) => {
                this.storeManagement.dispatch(new ManagementActions.ServiceRunRepoDiscoveryCompleteAction(data));
                this.store.dispatch(new DatabaseActions.ServiceInitializeDatabaseCompleteAction());
                this.localhostService.removeAllListeners([
                    'initialize database failed',
                    'run discovery complete']);
            });
            this.localhostService.socketEmit('initialize database', params);
            resolve();
        });
    }

    createNewDatabaseVersion(repoName: string): Promise<any> {
        return new Promise((resolve) => {
            this.localhostService.hookCallback('create database version failed', (data) => {
                this.store.dispatch(new DatabaseActions.ServiceCreateNewVersionFailedAction(data));
            });
            this.localhostService.hookCallback('run discovery complete', (data) => {
                this.storeManagement.dispatch(new ManagementActions.ServiceRunRepoDiscoveryCompleteAction(data));
                this.store.dispatch(new DatabaseActions.ServiceCreateNewVersionCompleteAction());
                this.localhostService.removeAllListeners([
                    'create database version failed',
                    'run discovery complete']);
            });
            this.localhostService.socketEmit('create database version', repoName);
            resolve();
        });
    }

    prepareUpdateObject(params: { repoName: string, fileName: string, mode: string }): Promise<any> {
        return new Promise((resolve) => {
            this.localhostService.hookCallback('prepare update object failed', (data) => {
                this.store.dispatch(new DatabaseActions.ServicePrepareUpdateObjectFailedAction(data));
            });
            this.localhostService.hookCallback('run discovery complete', (data) => {
                this.storeManagement.dispatch(new ManagementActions.ServiceRunRepoDiscoveryCompleteAction(data));
                this.store.dispatch(new DatabaseActions.ServiceCreateNewVersionCompleteAction());
                this.localhostService.removeAllListeners([
                    'prepare update object failed',
                    'run discovery complete']);
            });
            this.localhostService.socketEmit('prepare update object', params);
            resolve();
        });
    }

    setVersionAsInstalled(params: { repoName: string, versionName: string }): Promise<any> {
        console.log(params);
        return new Promise((resolve) => {
            this.localhostService.hookCallback('set version as installed failed', (data) => {
                this.store.dispatch(new DatabaseActions.ServicePrepareUpdateObjectFailedAction(data));
            });
            this.localhostService.hookCallback('run discovery complete', (data) => {
                this.storeManagement.dispatch(new ManagementActions.ServiceRunRepoDiscoveryCompleteAction(data));
                this.store.dispatch(new DatabaseActions.ServiceCreateNewVersionCompleteAction());
                this.localhostService.removeAllListeners([
                    'set version as installed failed',
                    'run discovery complete']);
            });
            this.localhostService.socketEmit('set version as installed', params);
            resolve();
        });
    }

    updateSetting(data: { settingName: string, settingValue: string, repoName: string, environment: string }): Promise<any> {
        return <Promise<any>>this.localhostService.post('database/setting/update', data);
    }

    installDatabase(params: { repoName?: string, version?: string, user?: string, fileName?: string, environment: string}): Promise<any> {
        return new Promise((resolve) => {
            this.localhostService.hookCallback('install database progress', (data) => {
                this.store.dispatch(new DatabaseActions.ServiceInstallDatabaseProgressAction(data));
            });
            this.localhostService.hookCallback('install database failed', (data) => {
                console.log(data);
                this.store.dispatch(new DatabaseActions.ServiceInstallDatabaseFailedAction(data));
            });
            this.localhostService.hookCallback('install database complete', (data) => {
                console.log(data);
                this.store.dispatch(new DatabaseActions.ServiceInstallDatabaseCompleteAction(data));
                this.localhostService.removeAllListeners([
                    'install database progress',
                    'install database failed',
                    'install database complete']);
            });

            this.localhostService.socketEmit('install database', params);
            resolve();
        });
    }
}
