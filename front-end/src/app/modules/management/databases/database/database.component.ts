import { Component, OnInit } from '@angular/core';
import * as fromDatabase from '../../../../store/reducers/database.reducers';
import * as DatabaseActions from '../../../../store/actions/database.actions';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import swal from 'sweetalert2';

@Component({
  selector: 'app-database',
  templateUrl: './database.component.html',
  styleUrls: ['./database.component.css']
})
export class DatabaseComponent implements OnInit {
  database$: Observable<fromDatabase.State>;
  filter: string;
  dbAlias: string;

  constructor(
    private store: Store<fromDatabase.State>
  ) { }

  ngOnInit() {
    this.database$ = this.store.select('databaseManagement');
    console.log('DatabaseComponent');
  }

  onFilter(filter: string) {
    this.filter = filter;
    this.store.dispatch(new DatabaseActions.FilterDatabaseFilesPageAction(filter));
  }

  onClickInitialize(repoName: string) {
    this.store.dispatch(new DatabaseActions.InitializeDatabasePageAction({ repoName: repoName, dbAlias: this.dbAlias }));
  }

  onCreateNewVersion(repoName: string) {
    this.store.dispatch(new DatabaseActions.CreateNewVersionPageAction(repoName));
  }

  public onCreateTable(tableName: string): void {
    console.log(tableName);
  }

  public onUpdateTable(tableName: string): void {
    console.log(tableName);
  }

  public onDropTable(tableName: string): void {
    console.log(tableName);
  }

  public onCreateFunction(functionName: string): void {
    console.log(functionName);
  }

  public onUpdateObject(params: {fileName: string, mode: string, repoName: string}): void {
    console.log(params);
    
    this.store.dispatch(new DatabaseActions.PrepareUpdateObjectPageAction(params));
  }

  closeSwal() {
    swal.close();
  }
}
