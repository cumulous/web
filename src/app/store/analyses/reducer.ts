import { Action } from '@ngrx/store';

import { Analysis } from '../../api';

import { createReducer } from '../reducer';
import { ItemsState } from '../state';
import { properties } from './properties';

const reducer = createReducer<Analysis>('analyses', properties);

export function analysesReducer(state: ItemsState<Analysis>, action: Action) {
  return reducer(state, action);
}
