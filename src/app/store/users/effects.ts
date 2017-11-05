import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
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
    router: Router,
    store: Store,
  ) {
    super('users', actions$, http, router, store);
  }
}
