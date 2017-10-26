import { Actions } from '@ngrx/effects';
import { Observable } from 'rxjs/Observable';
import * as isUUID from 'validator/lib/isUUID';

import { ApiService, Client, ListResponse, Project, User } from '../api';

import { Store, StoreItem } from './models';
import { createSelectors } from './selectors';

import {
  create, createSuccess,
  update, updateSuccess,
  get, getSuccess,
  list, listSuccess,
  routerNavigation,
} from './actions';

export abstract class EffectsService<Item extends StoreItem> {

  readonly create$ = this.actions$
    .filter(create<Item>(this.type).match)
    .map(action => action.payload)
    .mergeMap(payload =>
      this.api.post([this.type], payload)
        .map((response: Item) =>
          createSuccess<Item>(this.type)(response)
        )
    );

  readonly update$ = this.actions$
    .filter(update<Item>(this.type).match)
    .map(action => action.payload)
    .mergeMap(payload =>
      this.api.patch([this.type, payload.id], payload.changes)
        .map((response: Item) =>
          updateSuccess<Item>(this.type)(payload)
        )
    );

  readonly get$ = this.actions$
    .filter(get(this.type).match)
    .map(action => action.payload)
    .mergeMap(payload =>
      this.api.get([this.type, payload])
        .map((response: Item) =>
          getSuccess<Item>(this.type)(response)
        )
    );

  readonly list$ = this.actions$
    .filter(list(this.type).match)
    .map(action => action.payload)
    .switchMap(payload =>
      this.api.get([this.type], payload)
        .map((response: ListResponse<Item>) =>
          listSuccess<Item>(this.type)(response.items)
        )
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
    .filter(route => route.params.limit)
    .switchMap(route => Observable.of(list(this.type)(route.params)));

  private readonly projects$: Observable<{ [id: string]: Project }>;
  private readonly users$: Observable<{ [id: string]: User }>;
  private readonly clients$: Observable<{ [id: string]: Client }>;

  constructor(
    readonly type: string,
    private readonly actions$: Actions,
    private readonly api: ApiService,
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

  private getDetails<T>(type: string, ids: string[], storedMap: Observable<{ [id: string]: T }>) {
    return storedMap
      .map(stored => ids.filter(id => !stored[id]))
      .filter(newIds => newIds.length > 0)
      .map(newIds => new Set(newIds))
      .map(newIds => Array.from(newIds))
      .map(newIds => newIds.map(id => get(type)(id)))
      .mergeMap(actions => Observable.from(actions));
  }
}
