import { Actions } from '@ngrx/effects';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/mergeMap';

import {
  CreatePayload, create, createSuccess,
  UpdatePayload, update, updateSuccess,
  ListPayload, list, listSuccess,
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

  constructor(
    private readonly type: string,
    private readonly actions$: Actions,
  ) {}

  protected abstract create(payload: CreatePayload<Item>): Observable<Item>;
  protected abstract update(payload: UpdatePayload<Item>): Observable<Item>;
  protected abstract list(payload: ListPayload): Observable<{ items: Item[] }>;
}
