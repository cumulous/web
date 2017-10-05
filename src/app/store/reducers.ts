import { projectsReducer } from './projects/reducer';
import { datasetsReducer } from './datasets/reducer';
import { analysesReducer } from './analyses/reducer';

export const reducers = {
  projects: projectsReducer,
  datasets: datasetsReducer,
  analyses: analysesReducer,
};
