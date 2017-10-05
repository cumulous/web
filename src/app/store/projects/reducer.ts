import { Action } from '@ngrx/store';

import { Project } from '../../api';

import { createReducer } from '../reducer';
import { ItemsState } from '../state';
import { properties } from './properties';

const reducer = createReducer<Project>('projects', properties);

export function projectsReducer(state: ItemsState<Project>, action: Action) {
  return reducer(state, action);
}
