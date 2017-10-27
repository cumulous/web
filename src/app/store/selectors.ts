import { createFeatureSelector, createSelector } from '@ngrx/store';

import { entityAdapter, propertyAdapter } from './adapters';
import { StoreItem } from './models';
import { ItemsState, State } from './state';

export type Selector<T> = (state: State) => T;

export function createSelectors<Item extends StoreItem>(type: string) {
  const rootSelector = createFeatureSelector<ItemsState<Item>>(type);
  const isLoading = createSelector(rootSelector, state => state.requestCount > 0);
  const propertiesSelector = createSelector(rootSelector, state => state.properties);

  const adapter = entityAdapter<Item>();
  const items = adapter.getSelectors(rootSelector);
  const properties = propertyAdapter.getSelectors(propertiesSelector);

  return {
    isLoading,
    itemList: items.selectAll,
    itemMap: items.selectEntities,
    propertyList: properties.selectAll,
    propertyMap: properties.selectEntities,
  };
}

const authState = (state: State) => state.auth;

export const authSelectors = {
  token: createSelector(authState, state => state.token),
  fromUrl: createSelector(authState, state => state.fromUrl),
  config: createSelector(authState, state => state.config),
};

const apiState = (state: State) => state.api;

export const apiBaseSelector =
  createSelector(apiState, state => state.baseUrl);
