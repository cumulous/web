import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Actions, Effect } from '@ngrx/effects';

import { Project } from '../../api';

import { Store } from '../models';
import { EffectsService } from '../effects.service';

@Injectable()
export class ProjectEffects extends EffectsService<Project> {

  @Effect() readonly create$;
  @Effect() readonly update$;
  @Effect() readonly get$;
  @Effect() readonly list$;
  @Effect({ dispatch: false }) readonly listFailure$;
  @Effect() readonly routeList$;

  constructor(
    actions$: Actions,
    http: HttpClient,
    router: Router,
    store: Store,
  ) {
    super('projects', actions$, http, router, store);
  }
}
