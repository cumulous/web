import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';

import { list, ListPayload } from './actions';
import { Selector } from './selectors';
import { State } from './state';

@Injectable()
export class StoreService {
  constructor(private readonly store: Store<State>) {}

  select<T>(selector: Selector<T>) {
    return this.store.select(selector);
  }

  list(type: string, payload: ListPayload) {
    this.store.dispatch(list(type)(payload));
  }
}
