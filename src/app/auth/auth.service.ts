import { Injectable } from '@angular/core';

import { CognitoAuth } from 'amazon-cognito-auth-js/dist/amazon-cognito-auth';

import { AuthConfig } from './auth.config';

@Injectable()
export class AuthService {
  private readonly auth: CognitoAuth;

  constructor(config: AuthConfig) {
    this.auth = new CognitoAuth({
      ClientId: config.clientId,
      AppWebDomain: config.domain,
      TokenScopesArray: [],
      RedirectUriSignIn: window.location.href,
      RedirectUriSignOut: window.location.href,
    });
  }

  login() {
    this.parseResponse();
    this.getSession();
  }

  private parseResponse() {
    this.auth.parseCognitoWebResponse(window.location.href);
  }

  private getSession() {
    this.auth.getSession();
  }
}
