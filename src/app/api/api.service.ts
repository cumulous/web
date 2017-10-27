import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { combineLatest } from 'rxjs/observable/combineLatest';
import { Observable } from 'rxjs/Observable';

import { AuthService } from '../auth/auth.service';
import { apiBaseSelector, Store } from '../store';

export interface RequestParams {
  [key: string]: string | number | undefined;
};

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

  private params(params?: RequestParams): HttpParams {
    if (params === undefined) {
      return new HttpParams();
    }
    return Object.keys(params)
      .filter(k => params[k] !== undefined)
      .reduce(
        (p, k) => p.set(k, String(params[k])),
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

  get<R>(path: string[], params?: RequestParams): Observable<R> {
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
