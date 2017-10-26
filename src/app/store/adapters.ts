import { createEntityAdapter } from '@ngrx/entity';

import { Property, StoreItem } from './models';

export function entityAdapter<Item extends StoreItem>() {
  return createEntityAdapter<Item>();
}

export const propertyAdapter = createEntityAdapter<Property>({
  selectId: (property: Property) => property.name,
});
