import { Component, OnInit } from '@angular/core';
import * as fromServerless from '../../../../store/reducers/serverless.reducers';
import * as fromManagement from '../../../../store/reducers/management.reducers';
import * as DatabaseActions from '../../../../store/actions/database.actions';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import swal from 'sweetalert2';

@Component({
  selector: 'app-serverless-repo',
  templateUrl: './serverless-repo.component.html',
  styleUrls: ['./serverless-repo.component.css']
})
export class ServerlessRepoComponent implements OnInit {
  serverless$: Observable<fromServerless.State>;
  management$: Observable<fromManagement.State>;
  filter: string;
  dbAlias: string;

  constructor(
    private store: Store<fromServerless.State>
  ) { }

  ngOnInit() {
    this.serverless$ = this.store.select('serverless');
    this.management$ = this.store.select('management');
  }

}
