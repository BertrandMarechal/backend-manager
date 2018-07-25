import { LocalhostService } from './localhost.service';
import { Injectable } from '@angular/core';

@Injectable()
export class DatabaseService {
    constructor(
        private localhostService: LocalhostService,
    ) {

    }
    updateSetting(data: { settingName: string, settingValue: string, serviceName: string, environment: string }): Promise<any> {
        return <Promise<any>>this.localhostService.post('serverless/setting/update', data);
    }
}
