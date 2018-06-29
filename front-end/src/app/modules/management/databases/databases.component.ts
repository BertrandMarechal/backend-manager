import { Component, OnInit } from '@angular/core';
import * as fromManagement from '../../../store/reducers/management.reducers';
import * as ManagementActions from '../../../store/actions/management.actions';
import { Observable } from 'rxjs/internal/Observable';
import { Store } from '@ngrx/store';

type InstallationObjectType = 'Application' | 'Version' | 'Version step' | 'File';

@Component({
  selector: 'app-databases',
  templateUrl: './databases.component.html',
  styleUrls: ['./databases.component.css']
})
export class DatabasesComponent implements OnInit {
  management$: Observable<fromManagement.State>;

  constructor(private store: Store<fromManagement.State>) { }

  ngOnInit() {
    this.management$ = this.store.select('management');
  }

  onInstall(type: InstallationObjectType, item: any) {
    console.log(type, item);
  }

  onSaveParameters() {
    console.log('Save');
  }

  onSelectDatabase(database: any) {
    this.store.dispatch(new ManagementActions.SelecteDatabasePageAction(database));
  }
}
