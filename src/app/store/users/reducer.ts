import { Action } from '@ngrx/store';

import { User } from '../../api';

import { createReducer } from '../reducer';
import { ItemsState } from '../state';
import { properties } from './properties';

const reducer = createReducer<User>('users', properties);

export function usersReducer(state: ItemsState<User>, action: Action) {
  return reducer(state, action);
}
