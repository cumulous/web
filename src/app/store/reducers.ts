import { routerReducer } from '@ngrx/router-store';
import { ActionReducerMap, MetaReducer } from '@ngrx/store';

import { State } from './state';

import { projectsReducer } from './projects/reducer';
import { datasetsReducer } from './datasets/reducer';
import { analysesReducer } from './analyses/reducer';
import { storageReducer } from './storage';

export const reducers: ActionReducerMap<State> = {
  router: routerReducer,
  projects: projectsReducer,
  datasets: datasetsReducer,
  analyses: analysesReducer,
};

export const metaReducers: MetaReducer<any>[] = [
  storageReducer,
];
