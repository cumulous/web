import { createFeatureSelector, createSelector, Store } from '@ngrx/store';

import { entityAdapter, propertyAdapter } from './adapters';
import { StoreItem } from './models';
import { ItemsState } from './state';

export function createSelectors<Item extends StoreItem>(type: string) {
  const rootSelector = createFeatureSelector<ItemsState<Item>>(type);
  const isLoading = createSelector(rootSelector, state => state.isLoading);
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
