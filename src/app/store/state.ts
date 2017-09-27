import { EntityState } from '@ngrx/entity';

import { Property } from './models';

export interface ItemsState<Item> extends EntityState<Item> {
  isLoading: boolean;
  properties: EntityState<Property>;
}

export interface State {}
