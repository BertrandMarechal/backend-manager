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

    static getDatabaseFileLists(database: RepositoryFile): {functionFileList: string[], tableFileList: string[]} {
        const returnObject = {functionFileList: [], tableFileList: []};
        const fileList = database.databases.reduce((currentX, x) => {
            return currentX.concat(x.databases.reduce((currentY, y) => {
                return currentY.concat(y.databaseFiles.map(z => z.filePath));
            }, []));
        }, []).filter(x => x.indexOf('/postgres/') > -1);

        returnObject.functionFileList = fileList.filter(x => x.indexOf('07-functions') > -1);
        returnObject.tableFileList = fileList.filter(x => x.indexOf('03-tables') > -1);
        return returnObject;
    }

    initializeDatabase(params: {repoName: string, dbAlias: string}): Promise<any> {
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

    prepareUpdateObject(params: {repoName: string, fileName: string, mode: string}): Promise<any> {
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
}