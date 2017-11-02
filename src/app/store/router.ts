import { RouterStateSnapshot } from '@angular/router';
import { RouterStateSerializer } from '@ngrx/router-store';

import { RouterState } from './state';

export class RouterSerializer implements RouterStateSerializer<RouterState> {

  serialize(routerState: RouterStateSnapshot): RouterState {
    const state: RouterState = {
      url: routerState.url,
      params: {},
    };
    routerState.root.children.forEach(child => {
      state.params[child.outlet] = child.params;
    });
    return state;
  }
}
