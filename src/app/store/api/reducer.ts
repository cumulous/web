import { Action, ActionReducer } from '@ngrx/store';

import { environment } from '../../../environments/environment';
import { ApiState, State } from '../state';

const initialState = {
  baseUrl: environment.apiRoot,
};

export function apiReducer(state: ApiState = initialState, action: Action) {
  return state;
};
