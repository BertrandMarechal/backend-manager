import { Component, OnInit, Input, SimpleChanges, OnChanges } from '@angular/core';
import { RepositoryParameter } from '../../../../../models/database.model';
import * as fromDatabase from '../../../../../store/reducers/database.reducers';
import * as DatabaseActions from '../../../../../store/actions/database.actions';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';

@Component({
  selector: 'app-database-parameters',
  templateUrl: './database-parameters.component.html',
  styleUrls: ['./database-parameters.component.css']
})

export class DatabaseParametersComponent implements OnInit, OnChanges {
  @Input() parameters: RepositoryParameter[];
  @Input() environment: string;

  private notSetCount: number;
  database$: Observable<fromDatabase.State>;

  constructor(
    private store: Store<fromDatabase.State>
  ) { }

  ngOnInit() {
    this.database$ = this.store.select('databaseManagement');
    this.compileNotSetCount();
  }
  ngOnChanges(changes: SimpleChanges) {
    this.parameters = changes.parameters.currentValue;
    this.compileNotSetCount();
  }
  compileNotSetCount() {
    if (this.parameters) {
      this.notSetCount = this.parameters.filter(x => x.value === null).length;
    } else {
      this.notSetCount = 0;
    }
  }

  onKeyUp(settingName: string, settingValue: string) {
    console.log(settingName, settingValue);
    this.store.dispatch(new DatabaseActions.SaveSettingPageAction({
      settingName: settingName,
      settingValue: settingValue,
      environment: this.environment
    }))
  }

}
