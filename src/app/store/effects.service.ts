import { Actions } from '@ngrx/effects';

import { Observable } from 'rxjs/Observable';

import {
  CreatePayload, create, createSuccess,
  UpdatePayload, update, updateSuccess,
  ListPayload, list, listSuccess,
  routerNavigation,
} from './actions';

export abstract class EffectsService<Item> {

  readonly create$ = this.actions$
    .filter(create(this.type).match)
    .mergeMap(action => this.create(action.payload)
      .map(item => createSuccess(this.type)(item))
    );

  readonly update$ = this.actions$
    .filter(update(this.type).match)
    .mergeMap(action => this.update(action.payload)
      .map(() => updateSuccess(this.type)(action.payload))
    );

  readonly list$ = this.actions$
    .filter(list(this.type).match)
    .mergeMap(action => this.list(action.payload)
      .map(list => listSuccess(this.type)(list.items))
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
  ) {}

  protected abstract create(payload: CreatePayload<Item>): Observable<Item>;
  protected abstract update(payload: UpdatePayload<Item>): Observable<Item>;
  protected abstract list(payload: ListPayload): Observable<{ items: Item[] }>;
}
