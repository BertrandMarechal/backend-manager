import { Component, OnInit } from '@angular/core';
import * as fromManagement from '../../store/reducers/management.reducers';
import * as ManagementActions from '../../store/actions/management.actions';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-management',
  templateUrl: './management.component.html',
  styleUrls: ['./management.component.css']
})
export class ManagementComponent implements OnInit {

  management$: Observable<fromManagement.State>;
  databasesOpen: boolean;

  constructor(private store: Store<fromManagement.State>) { }

  ngOnInit() {
    this.management$ = this.store.select('management');
  }

  onRunDiscovery() {
    this.store.dispatch(new ManagementActions.RunRepoDiscoveryPageAction());
  }

  onSelecteEnvironment(environemnt: string) {
    this.store.dispatch(new ManagementActions.SelecteEnvironmentPageAction(environemnt));
  }

  onSelectDatabase(database: any) {
    this.store.dispatch(new ManagementActions.SelecteDatabasePageAction(database));
  }
}
