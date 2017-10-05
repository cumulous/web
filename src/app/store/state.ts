import { EntityState } from '@ngrx/entity';

import { Property } from './models';

import { Project, Dataset, Analysis } from '../api';

export interface ItemsState<Item> extends EntityState<Item> {
  isLoading: boolean;
  properties: EntityState<Property>;
}

export interface State {
  projects: ItemsState<Project>;
  datasets: ItemsState<Dataset>;
  analyses: ItemsState<Analysis>;
}
