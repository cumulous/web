import { Action } from '@ngrx/store';

import { Dataset } from '../../api';

import { createReducer } from '../reducer';
import { ItemsState } from '../state';
import { properties } from './properties';

const reducer = createReducer<Dataset>('datasets', properties);

export function datasetsReducer(state: ItemsState<Dataset>, action: Action) {
  return reducer(state, action);
}
