import { Router, RouterStateSnapshot } from '@angular/router';
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

export function notify(router: Router, data: string | Error) {
  return router.navigate([{
    outlets: {
      notification: ['message', {
        text: typeof data === 'string' ? data : data.message,
        class: typeof data === 'string' ? 'info' : 'error',
      }],
    },
  }]);
}
