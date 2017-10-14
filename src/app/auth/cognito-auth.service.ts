import { Injectable } from '@angular/core';
import { CognitoAuth } from 'amazon-cognito-auth-js/dist/amazon-cognito-auth';

import { Store } from '../store';
import { AuthService } from './auth.service';

@Injectable()
export class CognitoAuthService extends AuthService {

  constructor(store: Store) {
    super(store);
  }

  private get auth() {
    return this.config
      .map(config => new CognitoAuth({
        ClientId: config.clientId,
        AppWebDomain: config.domain,
        TokenScopesArray: [],
        RedirectUriSignIn: this.callbackUrl,
        RedirectUriSignOut: this.callbackUrl,
      }));
  }

  login() {
    return this.auth
      .map(auth => {
        const url = auth.getFQDNSignIn();
        auth.launchUri(url);
      });
  }

  logout() {
    return this.auth
      .map(auth => {
        const url = auth.getFQDNSignOut();
        auth.launchUri(url);
      });
  }
}
