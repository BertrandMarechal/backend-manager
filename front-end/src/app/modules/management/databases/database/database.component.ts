import { Component, OnInit } from '@angular/core';
import * as fromManagement from '../../../../store/reducers/management.reducers';
import * as ManagementActions from '../../../../store/actions/management.actions';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';

@Component({
  selector: 'app-database',
  templateUrl: './database.component.html',
  styleUrls: ['./database.component.css']
})
export class DatabaseComponent implements OnInit {
  management$: Observable<fromManagement.State>;
  filter: string;

  constructor(private store: Store<fromManagement.State>) { }

  ngOnInit() {
    this.management$ = this.store.select('management');
  }

  onFilter(filter: string) {
    this.filter = filter;
    this.store.dispatch(new ManagementActions.FilterDatabaseFilesPageAction(filter));
  }

}
