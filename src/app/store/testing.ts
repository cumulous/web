import { ROUTER_NAVIGATION } from '@ngrx/router-store';

import { RouterState } from './state';

export const routerNavigation = (routerState: Partial<RouterState>) => ({
  type: ROUTER_NAVIGATION,
  payload: {
    routerState,
  },
});
