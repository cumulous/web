import { Action, ActionReducer } from '@ngrx/store';
import { localStorageSync, rehydrateApplicationState } from 'ngrx-store-localstorage';
import { isType } from 'typescript-fsa';

import { storage } from './actions';
import { State } from './state';

export function storageReducer(reducer: ActionReducer<State>): ActionReducer<State> {
  return (state: State, action: Action) => {
    const keys = ['auth', 'projects', 'datasets', 'analyses', 'users', 'clients'];
    const reviver = (key: string, value: any) => value;

    if (isType(action, storage) && keys.includes(action.payload)) {
      const rehydratedState = rehydrateApplicationState(
        [{
          [action.payload]: reviver,
        }],
        localStorage,
        k => k,
      );

      return { ...state, ...rehydratedState };
    }

    return localStorageSync({
      keys: keys.map(key => ({ [key]: reviver })),
      rehydrate: true,
    })(reducer)(state, action);
  };
}
