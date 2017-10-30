import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Actions, Effect } from '@ngrx/effects';

import { User } from '../../api';

import { Store } from '../models';
import { EffectsService } from '../effects.service';

@Injectable()
export class UserEffects extends EffectsService<User> {

  @Effect() readonly create$;
  @Effect() readonly update$;
  @Effect() readonly get$;

  constructor(
    actions$: Actions,
    http: HttpClient,
    store: Store,
  ) {
    super('users', actions$, http, store);
  }
}
