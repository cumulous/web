import { Injectable } from '@angular/core';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { combineLatest } from 'rxjs/observable/combineLatest';
import { Observable } from 'rxjs/Observable';

import { AuthService } from '../auth/auth.service';
import { apiBaseSelector, Store } from '../store';

@Injectable()
export class ApiInterceptor implements HttpInterceptor {
  constructor(
    private readonly auth: AuthService,
    private readonly store: Store,
  ) {}

  private get baseUrl() {
    return this.store.select(apiBaseSelector).first();
  }

  private get token() {
    return this.auth.token.first();
  }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return combineLatest(this.baseUrl, this.token)
      .map(([baseUrl, token]) => request.clone({
        url: baseUrl + request.url,
        setHeaders: {
          Authorization: token,
        },
      }))
      .mergeMap(req => next.handle(req));
  }
}
