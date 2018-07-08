import { Component, OnInit } from '@angular/core';
import * as fromManagement from '../../store/reducers/management.reducers';
import * as fromDatabase from '../../store/reducers/database.reducers';
import * as ManagementActions from '../../store/actions/management.actions';
import * as DatabaseActions from '../../store/actions/database.actions';
import { Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';

@Component({
  selector: 'app-management',
  templateUrl: './management.component.html',
  styleUrls: ['./management.component.css']
})
export class ManagementComponent implements OnInit {

  management$: Observable<fromManagement.State>;
  databases$: Observable<fromDatabase.State>;
  databasesOpen: boolean;
  navbarOpen: boolean;
  sub: Subscription;

  constructor(
    private store: Store<fromManagement.State>,
    private storeDatabase: Store<fromDatabase.State>
  ) { }

  ngOnInit() {
    this.management$ = this.store.select('management');
    this.databases$ = this.storeDatabase.select('databaseManagement');
    this.sub = this.management$.subscribe((state: fromManagement.State) => {
      if (!this.navbarOpen && state.serverConnected) {
        this.sub.unsubscribe();
        setTimeout(() => {
          this.navbarOpen = true;
        }, 500);
      }
    });
  }

  onRunDiscovery() {
    this.store.dispatch(new ManagementActions.RunRepoDiscoveryPageAction());
  }

  onSelecteEnvironment(environemnt: string) {
    this.store.dispatch(new ManagementActions.SelecteEnvironmentPageAction(environemnt));
  }

  onSelectDatabase(database: any) {
    this.store.dispatch(new DatabaseActions.SelecteDatabasePageAction(database));
  }
}
