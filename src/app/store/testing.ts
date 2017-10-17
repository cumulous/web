import { getSourceMetadata } from '@ngrx/effects/src/effects_metadata';
import { ROUTER_NAVIGATION } from '@ngrx/router-store';

import { RouterState } from './state';

export type EffectsMetadata<T> = {
  [key in keyof T]?: undefined | {
    dispatch: boolean;
  };
};

export function getEffectsMetadata<T>(instance: T): EffectsMetadata<T> {
  const metadata: EffectsMetadata<T> = {};

  getSourceMetadata(instance).forEach(({ propertyName, dispatch }) => {
    metadata[propertyName] = { dispatch };
  });

  return metadata;
}

export const routerNavigation = (routerState: Partial<RouterState>) => ({
  type: ROUTER_NAVIGATION,
  payload: {
    routerState,
  },
});
