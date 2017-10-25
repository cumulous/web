import { AnalysisEffects } from './analyses/effects';
import { AuthEffects } from './auth/effects';
import { ClientEffects } from './clients/effects';
import { DatasetEffects } from './datasets/effects';
import { ProjectEffects } from './projects/effects';
import { UserEffects } from './users/effects';

export const effects = [
  AnalysisEffects,
  AuthEffects,
  ClientEffects,
  DatasetEffects,
  ProjectEffects,
  UserEffects,
];
