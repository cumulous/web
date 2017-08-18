import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import { CognitoAuth } from 'amazon-cognito-auth-js/dist/amazon-cognito-auth';

import { AuthConfig } from './auth.config';

@Injectable()
export class AuthService {
  private readonly auth: CognitoAuth;
  private session;

  constructor(config: AuthConfig, private router: Router) {
    this.auth = new CognitoAuth({
      ClientId: config.clientId,
      AppWebDomain: config.domain,
      TokenScopesArray: [],
      RedirectUriSignIn: this.callbackUrl,
      RedirectUriSignOut: this.callbackUrl,
    });
    this.auth.userhandler = {
      onSuccess: session => this.onSuccess(session),
      onFailure: () => this.onFailure(),
    };
  }

  private get callbackUrl() {
    return window.location.href.split('/').slice(0, 3).concat('login').join('/');
  }

  login() {
    this.auth.parseCognitoWebResponse(this.router.url);
    this.auth.getSession();
  }

  logout() {
    this.session = undefined;
    this.auth.signOut();
  }

  isAuthenticated() {
    return !!this.session && this.session.isValid();
  }

  private onSuccess(session) {
    this.session = session;
    this.router.navigateByUrl(this.guardedUrl);
  }

  private onFailure() {
    this.session = undefined;
  }

  set guardedUrl(url: string) {
    localStorage.setItem('guardedUrl', url);
  }

  get guardedUrl() {
    return localStorage.getItem('guardedUrl') || '/';
  }

  get accessToken() {
    return this.session && this.session.getAccessToken().getJwtToken();
  }
}
