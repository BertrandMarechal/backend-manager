import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import * as io from 'socket.io-client';
import { environment } from '../../environments/environment';
import * as fromManagement from '../store/reducers/management.reducers';
import * as ManagementActions from '../store/actions/management.actions';
import { Store } from '@ngrx/store';

@Injectable()
export class LocalhostService {
  socket: any;
  socketConnected: boolean;
  constructor(private httpClient: HttpClient,
    private store: Store<fromManagement.State>) {
      setTimeout(() => {
        this.socket = io.connect('http://localhost:' + environment.nodeServerPort);
        this.socket.on('connect', () => {
          this.store.dispatch(new ManagementActions.ManagementServerConnectedAction());
            this.socketConnected = true;
        });
        this.socket.on('disconnect', () => {
            this.store.dispatch(new ManagementActions.ManagementServerDisconnectedAction());
            this.socketConnected = false;
        });
      }, 500);
  }

  get(url: string) {
    return new Promise((resolve, reject) => {
      const httpOptions = {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        mode: 'no-cors',
        cache: 'no-cache',
        credentials: 'same-origin',
      };
      this.httpClient.get(`http://localhost:${environment.nodeServerPort}/${url}`, httpOptions).toPromise()
        .then((result) => {
          resolve(result);
        })
        .catch((result) => {
          reject(result);
        });
    });
  }
  post(url: string, body: any) {
    const httpOptions = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      mode: 'no-cors',
      cache: 'no-cache',
      credentials: 'same-origin',
    };
    return new Promise((resolve, reject) => {
      this.httpClient.post(`http://localhost:${environment.nodeServerPort}/${url}`,
        body,
        httpOptions).toPromise()
        .then((result) => {
          resolve(result);
        })
        .catch((result) => {
          reject({Payload: JSON.stringify(result)});
        });
    });
  }
  hookCallback(event: string, callback) {
    this.socket.on(event, (data) => {
      callback(data);
    });
  }
  socketEmit(event: string, data: any) {
    this.socket.emit(event, data, () => {});
  }
  hookPromise(event: string, callback) {
    return new Promise((resolve, reject) => {
      this.socket.on(event, (data) => {
        resolve(data);
      });
    });
  }

  removeAllListeners(events: string[]) {
    events.forEach(x => {
      this.socket.removeAllListeners(x);
    })
  }

}