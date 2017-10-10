import { RouterStateSnapshot } from '@angular/router';
import { RouterStateSerializer } from '@ngrx/router-store';

import { RouterState } from './state';

export class RouterSerializer implements RouterStateSerializer<RouterState> {

  serialize(routerState: RouterStateSnapshot): RouterState {
    return {
      url: routerState.url,
      params: routerState.root.queryParams,
    };
  }
}
