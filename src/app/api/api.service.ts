import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { combineLatest } from 'rxjs/observable/combineLatest';
import { Observable } from 'rxjs/Observable';

import { AuthService } from '../auth/auth.service';
import { apiBaseSelector, Store } from '../store';

@Injectable()
export class ApiService {
  constructor(
    private readonly auth: AuthService,
    private readonly http: HttpClient,
    private readonly store: Store,
  ) {}

  private get baseUrl(): Observable<string> {
    return this.store.select(apiBaseSelector);
  }

  private url(path: string[]): Observable<string> {
    return this.baseUrl.map(url => [url].concat(path).join('/'));
  }

  private get headers(): Observable<HttpHeaders> {
    return this.auth.token
      .map(token => new HttpHeaders({
        Authorization: token,
      }));
  }

  private params<P>(params?: P): HttpParams {
    return Object.keys(params || {}).reduce(
      (p, k) => p.set(k, params[k]),
      new HttpParams(),
    );
  }

  private request<R>(
        path: string[],
        requester: (url: string, headers: HttpHeaders) => Observable<R>,
      ): Observable<R> {
    return combineLatest(this.url(path), this.headers)
      .mergeMap(([url, headers]) => requester(url, headers));
  }

  get<P, R>(path: string[], params?: P): Observable<R> {
    return this.request<R>(path, (url, headers) =>
      this.http.get(url, {
        headers,
        params: this.params(params),
      })
    );
  }

  post<B, R>(path: string[], body?: B): Observable<R> {
    return this.request<R>(path, (url, headers) =>
      this.http.post(url, body, { headers })
    );
  }

  patch<B, R>(path: string[], body?: B): Observable<R> {
    return this.request<R>(path, (url, headers) =>
      this.http.patch(url, body, { headers })
    );
  }
}
