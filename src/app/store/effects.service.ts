import { Actions } from '@ngrx/effects';
import { Observable } from 'rxjs/Observable';

import { ApiService, ListResponse, Project } from '../api';

import { Store } from './models';
import { createSelectors } from './selectors';

import {
  create, createSuccess,
  update, updateSuccess,
  get, getSuccess,
  list, listSuccess,
  routerNavigation,
} from './actions';

export abstract class EffectsService<Item> {

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
    .mergeMap(items => this.getDetails<Project>('projects',
      items.map(item => item['project_id']),
      this.projects$,
    ));

  private readonly route$ = this.actions$
    .filter(routerNavigation.match)
    .map(action => action.payload.routerState)
    .filter(route => route.url.startsWith('/' + this.type));

  readonly routeList$ = this.route$
    .filter(route => route.params.limit)
    .switchMap(route => Observable.of(list(this.type)(route.params)));

  private readonly projects$: Observable<{ [id: string]: Project }>;

  constructor(
    private readonly type: string,
    private readonly actions$: Actions,
    private readonly api: ApiService,
    store: Store,
  ) {
    this.projects$ = this.selectProjects(store);
  }

  private selectProjects(store: Store) {
    const projects = createSelectors<Project>('projects');
    return store.select(projects.itemMap);
  }

  private getDetails<T>(type: string, ids: string[], storedMap: Observable<{ [id: string]: T }>) {
    return storedMap
      .map(stored => ids.filter(id => id && !stored[id]))
      .filter(newIds => newIds.length > 0)
      .map(newIds => new Set(newIds))
      .map(newIds => Array.from(newIds))
      .map(newIds => newIds.map(id => get(type)(id)))
      .mergeMap(actions => Observable.from(actions));
  }
}
