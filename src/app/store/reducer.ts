import { Action } from '@ngrx/store';
import { isType } from 'typescript-fsa';

import {
  create, createSuccess, createFailure,
  update, updateSuccess, updateFailure,
  get, getSuccess, getFailure,
  list, listSuccess, listFailure,
} from './actions';

import { entityAdapter, propertyAdapter } from './adapters';
import { Property, StoreItem } from './models';
import { ItemsState } from './state';

export function createReducer<Item extends StoreItem>(type: string, properties: Property[]) {

  const adapter = entityAdapter<Item>();

  const propertiesInitState = propertyAdapter.addAll(
    properties, propertyAdapter.getInitialState(),
  );

  const initialState = adapter.getInitialState({
    requestCount: 0,
    properties: propertiesInitState,
  });

  const requestReducer = (state: ItemsState<Item>, change: 1 | -1) => {
    return { ...state, requestCount: state.requestCount + change };
  };

  return function (state: ItemsState<Item> = initialState, action: Action) {
    if (isType(action, create<Item>(type)) ||
        isType(action, update<Item>(type)) ||
        isType(action, list(type)) ||
        isType(action, get(type))) {
      return requestReducer(state, 1);
    }
    if (isType(action, createSuccess<Item>(type)) ||
        isType(action, getSuccess<Item>(type)) ||
        isType(action, getFailure<Item>(type))) {
      return adapter.addOne(action.payload, requestReducer(state, -1));
    }
    if (isType(action, updateSuccess<Item>(type))) {
      return adapter.updateOne(action.payload, requestReducer(state, -1));
    }
    if (isType(action, listSuccess<Item>(type))) {
      return adapter.addAll(action.payload, requestReducer(state, -1));
    }
    if (isType(action, createFailure(type)) ||
        isType(action, updateFailure(type)) ||
        isType(action, listFailure(type))) {
      return requestReducer(state, -1);
    }
    return state;
  };
}
