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
  parametersValue: string[];

  private notSetCount: number;
  database$: Observable<fromDatabase.State>;

  constructor(
    private store: Store<fromDatabase.State>
  ) { }

  ngOnInit() {
    this.parametersValue = [];
    this.database$ = this.store.select('databaseManagement');
    this.database$.subscribe(() => {
      this.parametersValue = [];
    });
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

  onKeyUp(event: any, i: number) {
    this.parametersValue[i] = event.target.value;
    if (event.key && event.key === 'Enter') {
      this.store.dispatch(new DatabaseActions.SaveSettingPageAction({
        settingName: event.target.name,
        settingValue: event.target.value,
        environment: this.environment
      }));
    }
  }

}
