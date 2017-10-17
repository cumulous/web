import { routerReducer } from '@ngrx/router-store';
import { ActionReducerMap, MetaReducer } from '@ngrx/store';

import { State } from './state';

import { loginReducer, logoutReducer } from './auth/reducers';
import { apiReducer } from './api/reducer';
import { projectsReducer } from './projects/reducer';
import { datasetsReducer } from './datasets/reducer';
import { analysesReducer } from './analyses/reducer';
import { storageReducer } from './storage';

export const reducers: ActionReducerMap<State> = {
  auth: loginReducer,
  api: apiReducer,
  projects: projectsReducer,
  datasets: datasetsReducer,
  analyses: analysesReducer,
  routerReducer,
};

export const metaReducers: MetaReducer<any>[] = [
  storageReducer,
  logoutReducer,
];
