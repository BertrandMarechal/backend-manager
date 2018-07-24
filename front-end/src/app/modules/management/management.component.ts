import { Component, OnInit } from '@angular/core';
import * as fromManagement from '../../store/reducers/management.reducers';
import * as fromDatabase from '../../store/reducers/database.reducers';
import * as fromServerless from '../../store/reducers/serverless.reducers';
import * as ManagementActions from '../../store/actions/management.actions';
import * as DatabaseActions from '../../store/actions/database.actions';
import * as ServerlessActions from '../../store/actions/serverless.actions';
import { Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';
import { RepositoryFile } from '../../models/database.model';

@Component({
  selector: 'app-management',
  templateUrl: './management.component.html',
  styleUrls: ['./management.component.css']
})
export class ManagementComponent implements OnInit {

  management$: Observable<fromManagement.State>;
  databases$: Observable<fromDatabase.State>;
  serverless$: Observable<fromServerless.State>;
  databasesOpen: boolean;
  middleTiersOpen: boolean;
  navbarOpen: boolean;
  sub: Subscription;

  constructor(
    private store: Store<fromManagement.State>,
    private storeDatabase: Store<fromDatabase.State>
  ) { }

  ngOnInit() {
    this.management$ = this.store.select('management');
    this.databases$ = this.store.select('databaseManagement');
    this.serverless$ = this.store.select('serverless');
    this.sub = this.management$.subscribe((state: fromManagement.State) => {
      if (!this.navbarOpen && state.serverConnected) {
        if (this.sub) {
          this.sub.unsubscribe();
        }
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

  onSelectDatabase(database: RepositoryFile) {
    this.store.dispatch(new DatabaseActions.SelecteDatabasePageAction(database));
  }

  onSelectServerlessRepo(serverlessRepo: RepositoryFile) {
    this.store.dispatch(new ServerlessActions.SelecteServerlessPageAction(serverlessRepo));
  }
}
