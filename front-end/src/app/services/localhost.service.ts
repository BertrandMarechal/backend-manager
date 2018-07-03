import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import * as io from 'socket.io-client';
import { environment } from '../../environments/environment';
import * as fromManagement from '../store/reducers/management.reducers';
import * as ManagementActions from '../store/actions/management.actions';
import { Store } from '@ngrx/store';

@Injectable()
export class LocalhostService {
  socket: any;
  serverConnected: boolean;
  constructor(private httpClient: HttpClient,
    private store: Store<fromManagement.State>) {
    this.socket = io.connect('http://localhost:' + environment.nodeServerPort);
    this.socket.on('connect', () => {
      this.serverConnected = true;
      // dirty code to get the navbar sliding correctly
      setTimeout(() => {
        this.store.dispatch(new ManagementActions.ManagementServerDisconnectedAction());
        setTimeout(() => {
          this.store.dispatch(new ManagementActions.ManagementServerConnectedAction());
        }, 100);
      }, 100);
    });
    this.socket.on('disconnect', () => {
      this.store.dispatch(new ManagementActions.ManagementServerDisconnectedAction());
      this.serverConnected = false;
    });
  }

  private waitForConnection(): Promise<any> {
    return new Promise((resolve, reject) => {
      if (this.serverConnected) {
        resolve();
      } else {
        setTimeout(() => {
          this.waitForConnection()
            .then(resolve)
            .catch(reject);
        }, 200);
      }
    });
  }

  get(url: string) {
    return new Promise((resolve, reject) => {
      this.waitForConnection()
        .then(() => {
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
        })
        .catch(reject);
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
      this.waitForConnection()
        .then(() => {
          this.httpClient.post(`http://localhost:${environment.nodeServerPort}/${url}`,
            body,
            httpOptions).toPromise()
            .then((result) => {
              resolve(result);
            })
            .catch((result) => {
              reject({ Payload: JSON.stringify(result) });
            });
        })
        .catch((result) => {
          reject(result);
        });
    });
  }
  hookCallback(event: string, callback) {
    this.socket.on(event, (data) => {
      callback(data);
    });
  }
  socketEmit(event: string, data: any) {
    this.waitForConnection()
      .then(() => {
        this.socket.emit(event, data, () => { });
      }).catch((error) => {
        console.log(error);
      });
  }
  hookPromise(event: string, callback) {
    return new Promise((resolve, reject) => {
      this.waitForConnection()
        .then(() => {
          this.socket.on(event, (data) => {
            resolve(data);
          });
        })
        .catch (reject);
    });
  }
  removeAllListeners(events: string[]) {
    events.forEach(x => {
      this.socket.removeAllListeners(x);
    })
  }

}