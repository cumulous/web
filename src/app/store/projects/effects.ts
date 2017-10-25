import { Injectable } from '@angular/core';
import { Actions, Effect } from '@ngrx/effects';

import { ApiService, Project } from '../../api';

import { Store } from '../models';
import { EffectsService } from '../effects.service';

@Injectable()
export class ProjectEffects extends EffectsService<Project> {

  @Effect() readonly create$;
  @Effect() readonly update$;
  @Effect() readonly get$;
  @Effect() readonly list$;
  @Effect() readonly routeList$;

  constructor(
    actions$: Actions,
    api: ApiService,
    store: Store,
  ) {
    super('projects', actions$, api, store);
  }
}
