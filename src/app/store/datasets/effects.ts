import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Actions, Effect } from '@ngrx/effects';

import { Dataset } from '../../api';

import { Store } from '../models';
import { EffectsService } from '../effects.service';

@Injectable()
export class DatasetEffects extends EffectsService<Dataset> {

  @Effect() readonly create$;
  @Effect() readonly update$;
  @Effect() readonly list$;
  @Effect() readonly listSuccess$;
  @Effect({ dispatch: false }) readonly listFailure$;
  @Effect() readonly routeList$;

  constructor(
    actions$: Actions,
    http: HttpClient,
    router: Router,
    store: Store,
  ) {
    super('datasets', actions$, http, router, store);
  }
}
