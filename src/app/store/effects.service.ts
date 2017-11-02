import { HttpClient } from '@angular/common/http';
import { Actions } from '@ngrx/effects';
import { Observable } from 'rxjs/Observable';
import * as isUUID from 'validator/lib/isUUID';

import { Client, ListResponse, Project, requestParams, User } from '../api';

import { Store, StoreItem } from './models';
import { createSelectors } from './selectors';

import {
  create, createSuccess, createFailure,
  update, updateSuccess, updateFailure,
  get, getSuccess, getFailure,
  list, listSuccess, listFailure,
  routerNavigation,
} from './actions';

export abstract class EffectsService<Item extends StoreItem> {

  readonly create$ = this.actions$
    .filter(create<Item>(this.type).match)
    .mergeMap(({ payload }) =>
      this.http.post<Item>(
        this.type,
        payload,
      ).map(item =>
        createSuccess<Item>(this.type)(item),
      ).catch(err => Observable.of(
        createFailure(this.type)(err),
      ))
    );

  readonly update$ = this.actions$
    .filter(update<Item>(this.type).match)
    .mergeMap(({ payload }) =>
      this.http.patch<Item>(
        this.type + '/' + payload.id,
        payload.changes,
      ).map(item =>
        updateSuccess<Item>(this.type)({
          id: payload.id,
          changes: item,
        })
      ).catch(err => Observable.of(
        updateFailure(this.type)(err),
      ))
    );

  readonly get$ = this.actions$
    .filter(get(this.type).match)
    .mergeMap(({ payload }) =>
      this.http.get<Item>(
        this.type + '/' + payload,
      ).map(item =>
        getSuccess<Item>(this.type)(item),
      ).catch(err => Observable.of(
        getFailure<Item>(this.type)(
          Object.assign(err, {
            id: payload,
          }),
        ),
      ))
    );

  readonly list$ = this.actions$
    .filter(list(this.type).match)
    .switchMap(({ payload }) =>
      this.http.get<ListResponse<Item>>(
        this.type,
        requestParams(payload),
      ).map(response =>
        listSuccess<Item>(this.type)(response.items),
      ).catch(err => Observable.of(
        listFailure(this.type)(err),
      ))
    );

  readonly listSuccess$ = this.actions$
    .filter(listSuccess<Item>(this.type).match)
    .map(action => action.payload)
    .mergeMap(items => {
      const projects = this.getIds(items, 'project_id');

      const members = this.getIds(items, 'created_by');
      const users = members.filter(id => isUUID(id));
      const clients = members.filter(id => !isUUID(id));

      return this.getDetails('projects', projects, this.projects$)
        .merge(this.getDetails('users', users, this.users$))
        .merge(this.getDetails('clients', clients, this.clients$));
    });

  private readonly route$ = this.actions$
    .filter(routerNavigation.match)
    .map(action => action.payload.routerState)
    .filter(route => route.url.startsWith('/' + this.type));

  readonly routeList$ = this.route$
    .filter(route => route.params.primary.limit)
    .switchMap(route => Observable.of(list(this.type)(route.params.primary)));

  private readonly projects$: Observable<{ [id: string]: Project }>;
  private readonly users$: Observable<{ [id: string]: User }>;
  private readonly clients$: Observable<{ [id: string]: Client }>;

  constructor(
    readonly type: string,
    private readonly actions$: Actions,
    private readonly http: HttpClient,
    store: Store,
  ) {
    this.projects$ = this.selectItems('projects', store);
    this.users$ = this.selectItems('users', store);
    this.clients$ = this.selectItems('clients', store);
  }

  private selectItems<T extends StoreItem>(type: string, store: Store) {
    const selectors = createSelectors<T>(type);
    return store.select(selectors.itemMap);
  }

  private getIds(items: Item[], prop: string) {
    return items
      .map(item => item[prop])
      .filter(id => id);
  }

  private getDetails<T>
      (type: string, ids: string[], storedMap: Observable<{ [id: string]: T }>) {
    return storedMap
      .map(stored => ids.filter(id => !stored[id]))
      .filter(newIds => newIds.length > 0)
      .map(newIds => new Set(newIds))
      .map(newIds => Array.from(newIds))
      .map(newIds => newIds.map(id => get(type)(id)))
      .mergeMap(actions => Observable.from(actions));
  }
}
