import { Params } from '@angular/router';
import { EntityState } from '@ngrx/entity';
import { RouterReducerState } from '@ngrx/router-store';

import { Property } from './models';

import { Project, Dataset, Analysis } from '../api';

export interface AuthState {
  token?: string;
  fromUrl?: string;
  config: {
    expiresIn: number,
    [key: string]: any,
  };
}

export interface ApiState {
  baseUrl: string;
}

export interface RouterState {
  url: string;
  params: Params;
}

export interface ItemsState<Item> extends EntityState<Item> {
  isLoading: boolean;
  properties: EntityState<Property>;
}

export interface State {
  auth: AuthState;
  api: ApiState;
  projects: ItemsState<Project>;
  datasets: ItemsState<Dataset>;
  analyses: ItemsState<Analysis>;
  routerReducer: RouterReducerState<RouterState>;
}
