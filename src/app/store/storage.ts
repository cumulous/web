import { Action, ActionReducer } from '@ngrx/store';
import { localStorageSync, rehydrateApplicationState } from 'ngrx-store-localstorage';
import { isType } from 'typescript-fsa';

import { storage } from './actions';
import { State } from './state';

export function storageReducer(reducer: ActionReducer<any>): ActionReducer<any> {
  return (state: State, action: Action) => {
    const keys = ['auth', 'projects', 'datasets', 'analyses'];

    if (isType(action, storage) && keys.includes(action.payload)) {
      const rehydratedState = rehydrateApplicationState([action.payload], localStorage, k => k);
      return { ...state, ...rehydratedState };
    }

    return localStorageSync({
      keys,
      rehydrate: true,
    })(reducer)(state, action);
  };
}
