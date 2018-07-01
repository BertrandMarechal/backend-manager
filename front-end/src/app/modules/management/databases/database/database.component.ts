import { Component, OnInit } from '@angular/core';
import * as fromManagement from '../../../../store/reducers/management.reducers';
import * as fromDatabase from '../../../../store/reducers/database.reducers';
import * as ManagementActions from '../../../../store/actions/management.actions';
import * as DatabaseActions from '../../../../store/actions/database.actions';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';

@Component({
  selector: 'app-database',
  templateUrl: './database.component.html',
  styleUrls: ['./database.component.css']
})
export class DatabaseComponent implements OnInit {
  management$: Observable<fromManagement.State>;
  database$: Observable<fromManagement.State>;
  filter: string;
  dbAlias: string;

  constructor(
    private store: Store<fromManagement.State>,
    private storeDatabase: Store<fromDatabase.State>
  ) { }

  ngOnInit() {
    this.management$ = this.store.select('management');
    this.database$ = this.storeDatabase.select('database');
    console.log('DatabaseComponent');
  }

  onFilter(filter: string) {
    this.filter = filter;
    this.store.dispatch(new ManagementActions.FilterDatabaseFilesPageAction(filter));
  }

  onClickInitialize(repoName: string) {
    this.storeDatabase.dispatch(new DatabaseActions.InitializeDatabasePageAction({repoName: repoName, dbAlias: this.dbAlias}));
  }

  onCreateNewVersion(repoName: string) {
    this.storeDatabase.dispatch(new DatabaseActions.CreateNewVersionPageAction(repoName));
  }

}
