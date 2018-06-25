import { LocalhostService } from "./localhost.service";
import { ManagementSetting } from "../models/management-settings.model";
import { Injectable } from "@angular/core";
import * as fromManagement from '../store/reducers/management.reducers';
import * as ManagementActions from '../store/actions/management.actions';
import { Store } from "@ngrx/store";

@Injectable()
export class ManagementService {
    constructor(
        private localhostService: LocalhostService,
        private store: Store<fromManagement.State>
    ) {

    }

    getSettings(): Promise<ManagementSetting[]> {
        // return Promise.resolve([]);
        return <Promise<ManagementSetting[]>>this.localhostService.get('settings');
    }

    updateSettings(data: ManagementSetting[]): Promise<ManagementSetting[]> {
        return <Promise<ManagementSetting[]>>this.localhostService.post('settings/update', data);
    }

    runRepoDiscovery(): Promise<any> {
        return new Promise((resolve) => {
            this.localhostService.hookCallback('run discovery progress', (data) => {
                this.store.dispatch(new ManagementActions.ServiceRunRepoDiscoveryProgressAction(data));
            });
            this.localhostService.hookCallback('run discovery failed', (data) => {
                this.store.dispatch(new ManagementActions.ServiceRunRepoDiscoveryFailedAction(data));
            });
            this.localhostService.hookCallback('run discovery complete', () => {
                this.store.dispatch(new ManagementActions.ServiceRunRepoDiscoveryCompleteAction());
            this.localhostService.removeAllListeners([
                'run discovery progress',
                'run discovery failed',
                'run discovery complete']);
            });
            this.localhostService.socketEmit('run discovery', null);
            resolve();
        })
    }
}