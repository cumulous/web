import { Action } from '@ngrx/store';

import { Client } from '../../api';

import { createReducer } from '../reducer';
import { ItemsState } from '../state';
import { properties } from './properties';

const reducer = createReducer<Client>('clients', properties);

export function clientsReducer(state: ItemsState<Client>, action: Action) {
  return reducer(state, action);
}
