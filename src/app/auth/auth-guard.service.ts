import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, CanActivateChild, CanLoad,
         Route, Router, RouterStateSnapshot } from '@angular/router';

import { AuthService } from './auth.service';

@Injectable()
export class AuthGuardService implements CanActivate, CanActivateChild, CanLoad {

  constructor(private readonly auth: AuthService, private readonly router: Router) {}

  private checkLogin(url: string) {
    if (this.auth.isAuthenticated()) {
      return true;
    } else {
      this.auth.guardedUrl = url;
      this.router.navigate(['login']);
      return false;
    }
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    return this.checkLogin(state.url);
  }

  canActivateChild(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    return this.canActivate(route, state);
  }

  canLoad(route: Route) {
    return this.checkLogin(`/${route.path}`);
  }
}
