import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import { AuthProviderService } from './auth-provider.service';

import { Configuration as ApiConfig } from '../api/configuration';

@Injectable()
export class AuthService {
  constructor(
    private readonly auth: AuthProviderService,
    private readonly apiConfig: ApiConfig,
    private readonly router: Router,
  ) {}

  login() {
    this.auth.signIn(
      this.router.url,
      this.onSignInSuccess,
      this.onSignInFailure,
    );
  }

  logout() {
    this.apiKey = undefined;
    this.auth.signOut();
  }

  isAuthenticated() {
    return this.auth.isValid();
  }

  set guardedUrl(url: string) {
    sessionStorage.setItem('guardedUrl', url);
  }

  get guardedUrl() {
    return sessionStorage.getItem('guardedUrl') || '/';
  }

  private readonly onSignInSuccess = () => {
    this.apiKey = this.auth.getAccessToken();
    this.router.navigateByUrl(this.guardedUrl);
  }

  private readonly onSignInFailure = (err: Error) => {
    this.logout();
  }

  private set apiKey(token: string) {
    this.apiConfig.apiKeys.Authorization = token;
  }
}
