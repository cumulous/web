import { Actions } from '@ngrx/effects';
import { Observable } from 'rxjs/Observable';

import { ApiService, ListResponse } from '../api';

import {
  create, createSuccess,
  update, updateSuccess,
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

  readonly list$ = this.actions$
    .filter(list(this.type).match)
    .map(action => action.payload)
    .switchMap(payload =>
      this.api.get([this.type], payload)
        .map((response: ListResponse<Item>) =>
          listSuccess<Item>(this.type)(response.items)
        )
    );

  private route$ = this.actions$
    .filter(routerNavigation.match)
    .map(action => action.payload.routerState)
    .filter(route => route.url.startsWith('/' + this.type));

  readonly routeList$ = this.route$
    .filter(route => route.params.limit)
    .switchMap(route => Observable.of(list(this.type)(route.params)));

  constructor(
    private readonly type: string,
    private readonly actions$: Actions,
    private readonly api: ApiService,
  ) {}
}
