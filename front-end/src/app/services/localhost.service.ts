import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import * as io from 'socket.io-client';
import { environment } from '../../environments/environment';
import * as fromManagement from '../store/reducers/management.reducers';
import * as ManagementActions from '../store/actions/management.actions';
import { Store } from '@ngrx/store';

@Injectable()
export class LocalhostService {
  socketManagement: any;
  socketLambda: any;
  serverConnected: boolean;
  constructor(private httpClient: HttpClient,
    private store: Store<fromManagement.State>) {
    this.socketManagement = io.connect('http://localhost:' + environment.nodeServerPort);
    this.socketManagement.on('connect', () => {
      this.serverConnected = true;
      // dirty code to get the navbar sliding correctly
      setTimeout(() => {
        this.store.dispatch(new ManagementActions.ManagementServerDisconnectedAction());
        setTimeout(() => {
          this.store.dispatch(new ManagementActions.ManagementServerConnectedAction());
        }, 100);
      }, 100);
    });
    this.socketManagement.on('disconnect', () => {
      this.store.dispatch(new ManagementActions.ManagementServerDisconnectedAction());
      this.serverConnected = false;
    });

    this.socketLambda = io.connect('http://localhost:' + environment.lambdaServerPort);
    this.socketLambda.on('connect', () => {
      this.store.dispatch(new ManagementActions.ManagementLambdaServerConnectedAction());
    });
    this.socketLambda.on('disconnect', () => {
      this.store.dispatch(new ManagementActions.ManagementLambdaServerDisconnectedAction());
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
  hookManagementCallback(event: string, callback) {
    console.log('Hooking ' + event);
    this.socketManagement.on(event, (data) => {
      callback(data);
    });
  }
  hookLambdaCallback(event: string, callback) {
    console.log('Hooking ' + event);
    this.socketLambda.on(event, (data) => {
      callback(data);
    });
  }
  socketEmit(event: string, data: any) {
    this.waitForConnection()
      .then(() => {
        this.socketManagement.emit(event, data, () => { });
      }).catch((error) => {
        console.log(error);
      });
  }
  hookManagementPromise(event: string, callback) {
    return new Promise((resolve, reject) => {
      this.waitForConnection()
        .then(() => {
          this.socketManagement.on(event, (data) => {
            resolve(data);
          });
        })
        .catch (reject);
    });
  }
  hookLambdaPromise(event: string, callback) {
    return new Promise((resolve, reject) => {
      this.waitForConnection()
        .then(() => {
          this.socketLambda.on(event, (data) => {
            resolve(data);
          });
        })
        .catch (reject);
    });
  }
  removeAllListeners(events: string[]) {
    events.forEach(x => {
      this.socketManagement.removeAllListeners(x);
    })
  }

}