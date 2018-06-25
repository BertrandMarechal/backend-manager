import { Component, OnInit } from '@angular/core';
import * as fromManagement from '../../../store/reducers/management.reducers';
import { Observable } from 'rxjs/internal/Observable';
import { Store } from '@ngrx/store';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent implements OnInit {
  management$: Observable<fromManagement.State>;

  constructor(private store: Store<fromManagement.State>) { }

  ngOnInit() {
    this.management$ = this.store.select('management');
  }
}
