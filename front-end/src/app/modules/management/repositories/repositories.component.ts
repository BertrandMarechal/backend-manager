import { Component, OnInit } from '@angular/core';
import * as fromManagement from '../../../store/reducers/management.reducers';
import { Observable } from 'rxjs/internal/Observable';
import { Store } from '@ngrx/store';

@Component({
  selector: 'app-repositories',
  templateUrl: './repositories.component.html',
  styleUrls: ['./repositories.component.css']
})
export class RepositoriesComponent implements OnInit {
  management$: Observable<fromManagement.State>;

  constructor(private store: Store<fromManagement.State>) { }

  ngOnInit() {
    this.management$ = this.store.select('management');
  }
}
