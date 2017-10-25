import { Injectable } from '@angular/core';
import { Actions, Effect } from '@ngrx/effects';

import { ApiService, Analysis } from '../../api';

import { Store } from '../models';
import { EffectsService } from '../effects.service';

@Injectable()
export class AnalysisEffects extends EffectsService<Analysis> {

  @Effect() readonly create$;
  @Effect() readonly update$;
  @Effect() readonly list$;
  @Effect() readonly listSuccess$;
  @Effect() readonly routeList$;

  constructor(
    actions$: Actions,
    api: ApiService,
    store: Store,
  ) {
    super('analyses', actions$, api, store);
  }
}
