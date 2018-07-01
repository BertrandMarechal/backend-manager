import { Component, OnInit } from '@angular/core';
import * as fromManagement from '../../../../store/reducers/management.reducers';
import * as ManagementActions from '../../../../store/actions/management.actions';
import { Observable } from 'rxjs/internal/Observable';
import { Store } from '@ngrx/store';

type InstallationObjectType = 'Application' | 'Version' | 'Version step' | 'File';

@Component({
  selector: 'app-install-databases',
  templateUrl: './install-databases.component.html',
  styleUrls: ['./install-databases.component.css']
})
export class InstallDatabasesComponent implements OnInit {
  management$: Observable<fromManagement.State>;

  constructor(private store: Store<fromManagement.State>) { }

  ngOnInit() {
    this.management$ = this.store.select('management');
  }

  onInstall(type: InstallationObjectType, item: any) {
    console.log(type, item);
  }
}
