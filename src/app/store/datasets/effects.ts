import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
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
  @Effect() readonly routeList$;

  constructor(
    actions$: Actions,
    http: HttpClient,
    store: Store,
  ) {
    super('datasets', actions$, http, store);
  }
}
