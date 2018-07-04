import { Component, OnInit } from '@angular/core';
import * as fromDatabase from '../../../../../store/reducers/database.reducers';
import * as DatabaseActions from '../../../../../store/actions/database.actions';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';

@Component({
  selector: 'app-log-progress',
  templateUrl: './log-progress.component.html',
  styleUrls: ['./log-progress.component.css']
})
export class LogProgressComponent implements OnInit {
  database$: Observable<fromDatabase.State>;

  constructor(
    private store: Store<fromDatabase.State>
  ) { }

  ngOnInit() {
    this.database$ = this.store.select('databaseManagement');
  }
}
