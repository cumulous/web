import { Injectable } from '@angular/core';
import { Actions, Effect } from '@ngrx/effects';

import { ApiService, User } from '../../api';

import { Store } from '../models';
import { EffectsService } from '../effects.service';

@Injectable()
export class UserEffects extends EffectsService<User> {

  @Effect() readonly create$;
  @Effect() readonly update$;
  @Effect() readonly get$;

  constructor(
    actions$: Actions,
    api: ApiService,
    store: Store,
  ) {
    super('users', actions$, api, store);
  }
}
