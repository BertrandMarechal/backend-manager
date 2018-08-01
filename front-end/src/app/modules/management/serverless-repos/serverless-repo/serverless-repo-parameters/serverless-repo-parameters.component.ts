import { Component, OnInit, Input, Output, SimpleChanges, OnChanges } from '@angular/core';
import { LambdaFunctionParameter } from '../../../../../models/database.model';
import { Observable } from 'rxjs';
import * as fromServerless from '../../../../../store/reducers/serverless.reducers';
import * as ServerlessActions from '../../../../../store/actions/serverless.actions';
import { Store } from '@ngrx/store';

@Component({
  selector: 'app-serverless-repo-parameters',
  templateUrl: './serverless-repo-parameters.component.html',
  styleUrls: ['./serverless-repo-parameters.component.css']
})
export class ServerlessRepoParametersComponent implements OnInit, OnChanges {
  @Input() environment: string;
  @Input() serviceName: string;
  @Input() updated: boolean;
  @Input() parameter: LambdaFunctionParameter;

  parameterValue: string;
  constructor(
    private store: Store<fromServerless.State>
  ) { }

  ngOnInit() {
    this.parameterValue = '';
  }
  ngOnChanges(changes: SimpleChanges): void {
    console.log(changes);
    if (changes['environment']) {
      this.environment = changes['environment'].currentValue;
    }
    if (changes['updated']) {
      this.updated = changes['updated'].currentValue;
    }
    if (changes['serviceName']) {
      this.serviceName = changes['serviceName'].currentValue;
    }
    if (changes['parameter']) {
      this.parameter = changes['parameter'].currentValue;
      this.parameterValue = this.parameter.value;
    }
  }
  onKeyUp(event: any) {
    this.parameterValue = event.target.value;
    if (event.key && event.key === 'Enter') {
      this.store.dispatch(new ServerlessActions.SaveServerlessSettingPageAction({
        settingName: event.target.name,
        settingValue: event.target.value,
        environment: this.environment,
        serviceName: this.serviceName,
      }));
    }
  }

}
