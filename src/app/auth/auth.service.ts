import * as jwtDecode from 'jwt-decode';

import { Observable } from 'rxjs/Observable';

import { authSelectors, Store } from '../store';

export abstract class AuthService {
  constructor(
    private readonly store: Store,
  ) {}

  protected get callbackUrl() {
    return 'https://' + window.location.hostname + '/login';
  }

  protected get config() {
    return this.store.select(authSelectors.config);
  }

  get token() {
    return this.store.select(authSelectors.token);
  }

  get fromUrl() {
    return this.store.select(authSelectors.fromUrl);
  }

  get isAuthenticated() {
    return this.config
      .withLatestFrom(this.token)
      .map(([config, token]) => this.isValid(token, config.expiresIn))
      .catch(() => Observable.of(false));
  }

  private isValid(token: string, expiresIn: number) {
    const now = Math.floor(new Date().getTime() / 1000);
    return now < jwtDecode(token).iat + expiresIn;
  }

  abstract login(): Observable<void>;

  abstract logout(): Observable<void>;
}
