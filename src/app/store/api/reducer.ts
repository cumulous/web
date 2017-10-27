import { Action } from '@ngrx/store';

import { environment } from '../../../environments/environment';
import { ApiState } from '../state';

const initialState = { ...environment.api };

export function apiReducer(state: ApiState = initialState, _action: Action) {
  return state;
};
