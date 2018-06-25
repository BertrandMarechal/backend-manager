import { Component, OnInit } from '@angular/core';

import * as ManagementActions from '../../../store/actions/management.actions';
import * as fromManagement from '../../../store/reducers/management.reducers';
import { Observable } from 'rxjs/internal/Observable';
import { Store } from '@ngrx/store';
import { ManagementSetting } from '../../../models/management-settings.model';

@Component({
  selector: 'app-settings-edit',
  templateUrl: './settings-edit.component.html',
  styleUrls: ['./settings-edit.component.css']
})
export class SettingsEditComponent implements OnInit {
  management$: Observable<fromManagement.State>;

  changedSettings: ManagementSetting[];

  constructor(private store: Store<fromManagement.State>) { }

  ngOnInit() {
    this.changedSettings = [];
    this.management$ = this.store.select('management');
  }

  onSettingChanged(setting: ManagementSetting, value: string) {
    const existingIndex = this.changedSettings.findIndex(x => x.id === setting.id);
    if (setting.value !== value) {
      if (existingIndex === -1) {
        this.changedSettings.push({
          ...setting,
          value: value
        });
      } else {
        this.changedSettings[existingIndex].value = value;
      }
    } else {
      if (existingIndex > -1) {
        this.changedSettings.splice(existingIndex,1);
      }
    }
  }

  onSubmit() {
    this.store.dispatch(new ManagementActions.UpdateSettingsPageAction(this.changedSettings));
  }
}
