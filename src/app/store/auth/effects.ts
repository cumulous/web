import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Actions, Effect } from '@ngrx/effects';

import { AuthService } from '../../auth/auth.service';

import {
  login,
  loginSuccess,
  loginRedirect,
  logout,
  routerNavigation,
} from '../actions';

@Injectable()
export class AuthEffects {

  @Effect({ dispatch: false })
  readonly login$ = this.actions$
    .filter(login.match)
    .switchMap(() => this.auth.login());

  @Effect()
  readonly loginSuccess$ = this.actions$
    .filter(loginSuccess.match)
    .mergeMap(() => this.auth.fromUrl.first()
      .map(url => loginRedirect(url))
    );

  @Effect({ dispatch: false })
  readonly loginRedirect$ = this.actions$
    .filter(loginRedirect.match)
    .do(action => this.router.navigateByUrl(action.payload));

  @Effect({ dispatch: false })
  readonly logout$ = this.actions$
    .filter(logout.match)
    .switchMap(() => this.auth.logout());

  private route$ = this.actions$
    .filter(routerNavigation.match)
    .map(action => action.payload.routerState)
    .filter(route => route.url.startsWith('/login'));

  @Effect()
  readonly routeLogin$ = this.route$
    .filter(route => route.url === '/login' || route.params.from)
    .map(route => login(route.params.from || ''));

  @Effect()
  readonly routeLoginResponse$ = this.route$
    .map(route => route.url.match(/access_token=([^&]*)/))
    .filter(matches => matches !== null)
    .map(matches => loginSuccess(matches![1]));

  @Effect()
  readonly routeLogout$ = this.route$
    .filter(route => route.params.logout === 'true')
    .map(() => logout());

  constructor(
    private readonly actions$: Actions,
    private readonly auth: AuthService,
    private readonly router: Router,
  ) {}
}
