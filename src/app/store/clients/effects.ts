import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Actions, Effect } from '@ngrx/effects';

import { Client } from '../../api';

import { Store } from '../models';
import { EffectsService } from '../effects.service';

@Injectable()
export class ClientEffects extends EffectsService<Client> {

  @Effect() readonly create$;
  @Effect() readonly update$;
  @Effect() readonly get$;

  constructor(
    actions$: Actions,
    http: HttpClient,
    store: Store,
  ) {
    super('clients', actions$, http, store);
  }
}
