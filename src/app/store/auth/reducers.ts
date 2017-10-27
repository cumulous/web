import { Action, ActionReducer } from '@ngrx/store';

import { isType } from 'typescript-fsa';

import { environment } from '../../../environments/environment';
import { login, loginSuccess, loginRedirect, logout } from '../actions';
import { AuthState, State } from '../state';

const initialState = {
  token: '',
  fromUrl: '',
  config: { ...environment.auth },
};

export function loginReducer(state: AuthState = initialState, action: Action) {
  if (isType(action, login)) {
    return { ...state, fromUrl: action.payload };
  }
  if (isType(action, loginSuccess)) {
    return { ...state, token: action.payload };
  }
  if (isType(action, loginRedirect)) {
    return { ...state, fromUrl: '' };
  }
  return state;
};

export function logoutReducer(reducer: ActionReducer<State>) {
  return (state: State | undefined, action: Action) => {
    if (isType(action, logout)) {
      state = undefined;
    }
    return reducer(state, action);
  };
}
