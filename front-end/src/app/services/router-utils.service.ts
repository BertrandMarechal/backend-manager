import {ActivatedRouteSnapshot} from '@angular/router';
import {ROUTER_NAVIGATION, RouterNavigationAction} from '@ngrx/router-store';
import {of} from "rxjs/internal/observable/of";
import {Observable} from "rxjs/internal/Observable";
import {catchError, filter, mergeMap, switchMap, withLatestFrom} from 'rxjs/operators';

export class RouterUtilsService {
  static isSegmentAtLevel(segment: string, level: number, route: ActivatedRouteSnapshot) {
    if (level === 0) {
      return route.firstChild.routeConfig.path === segment;
    } else {
      return RouterUtilsService.isSegmentAtLevel(segment, level - 1, route.firstChild);
    }
  }

  static getSegmentAtLevel(segment: string, level: number, route: RouterNavigationAction | ActivatedRouteSnapshot): ActivatedRouteSnapshot {
    const firstChild = (<ActivatedRouteSnapshot>route).firstChild || (<RouterNavigationAction>route).payload.routerState.root.firstChild;
    if (level === 0) {
      return firstChild;
    } else {
      return RouterUtilsService.isSegmentAtLevel(segment, level - 1, firstChild);
    }
  }
  static getSegment(segment: string[], route: RouterNavigationAction | ActivatedRouteSnapshot): ActivatedRouteSnapshot {
    let firstChild = (<ActivatedRouteSnapshot>route).firstChild;
    if (!firstChild) {
      if ((<RouterNavigationAction>route).payload) {
        firstChild = (<RouterNavigationAction>route).payload.routerState.root.firstChild;
      }
    }
    if (segment.length === 1 && firstChild && (firstChild.routeConfig.path === segment[0] || firstChild.url[0].path === segment[0])) {
      return firstChild;
    } else {
      const subSegment = [...segment];
      if (firstChild && firstChild.routeConfig.path === '') {
        return RouterUtilsService.getSegment(subSegment, firstChild);
      } else if (firstChild && segment.length > 1) {
        subSegment.splice(0, 1);
        return RouterUtilsService.getSegment(subSegment, firstChild);
      } else if (firstChild && segment.length === 1) {
        if (firstChild.firstChild) {
          if (firstChild.firstChild.url[0].path === segment[0]) {
            return firstChild;
          }
        }
        return RouterUtilsService.getSegment(subSegment, firstChild);
      }
      return null;
    }
  }


  static handleNavigation(segment: string, actions: any, store: any, callback: (a: ActivatedRouteSnapshot, state: any) => Observable<any>) {
    return actions.ofType(ROUTER_NAVIGATION)
      .pipe(
        mergeMap((x: RouterNavigationAction) => {
          return [RouterUtilsService.getSegment(segment.split('/'), x)];
        }),
        filter(Boolean),
        withLatestFrom(store),
        switchMap(a => {
          return callback(a[0], a[1]);
        }),
        catchError(e => {
          return of();
        })
      )
  }
}
