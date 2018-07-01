import { Component, OnInit } from '@angular/core';
import * as fromDatabase from '../../../../store/reducers/database.reducers';
import * as DatabaseActions from '../../../../store/actions/database.actions';
import { Observable } from 'rxjs/internal/Observable';
import { Store } from '@ngrx/store';

type InstallationObjectType = 'Application' | 'Version' | 'Version step' | 'File';

@Component({
  selector: 'app-install-databases',
  templateUrl: './install-databases.component.html',
  styleUrls: ['./install-databases.component.css']
})
export class InstallDatabasesComponent implements OnInit {
  database$: Observable<fromDatabase.State>;

  constructor(private store: Store<fromDatabase.State>) { }

  ngOnInit() {
    this.database$ = this.store.select('databaseManagement');
  }

  onInstall(type: InstallationObjectType, item: any) {
    console.log(type, item);
  }
}
