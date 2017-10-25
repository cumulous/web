import { Params } from '@angular/router';
import { EntityState } from '@ngrx/entity';
import { RouterReducerState } from '@ngrx/router-store';

import { Analysis, Client, Dataset, Project, User } from '../api';
import { Property } from './models';

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
  requestCount: number;
  properties: EntityState<Property>;
}

export interface State {
  auth: AuthState;
  api: ApiState;
  projects: ItemsState<Project>;
  datasets: ItemsState<Dataset>;
  analyses: ItemsState<Analysis>;
  users: ItemsState<User>;
  clients: ItemsState<Client>;
  routerReducer: RouterReducerState<RouterState>;
}
