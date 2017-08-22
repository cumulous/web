import { Injectable } from '@angular/core';
import { CognitoAuth, CognitoAuthSession } from 'amazon-cognito-auth-js/dist/amazon-cognito-auth';
import * as jwtDecode from 'jwt-decode';

import { AuthProviderService } from './auth-provider.service';
import { AuthProviderConfig } from './auth-provider.config';

@Injectable()
export class CognitoAuthProviderService extends AuthProviderService {
  private auth: CognitoAuth;

  constructor(private readonly config: AuthProviderConfig) {
    super();

    this.auth = new CognitoAuth({
      ClientId: config.clientId,
      AppWebDomain: config.domain,
      TokenScopesArray: [],
      RedirectUriSignIn: super.getCallbackUrl(),
      RedirectUriSignOut: super.getCallbackUrl(),
    });

    CognitoAuthSession.prototype.isValid = () => this.isValid();
  }

  signIn(tokenUrl: string, onSuccess: () => void, onFailure: (err: Error) => void) {

    this.auth.userhandler = {
      onSuccess,
      onFailure,
    };

    this.auth.parseCognitoWebResponse(tokenUrl);

    if (!this.isValid()) {
      this.auth.getSession();
    }
  }

  signOut() {
    this.auth.signOut();
  }

  private getCognitoAccessToken() {
    const session = this.auth.getSignInUserSession();
    return session == null ? undefined : session.getAccessToken();
  }

  getAccessToken() {
    const token = this.getCognitoAccessToken();
    return token == null ? undefined : token.getJwtToken();
  }

  isValid() {
    const now = Math.floor(new Date().getTime() / 1000);
    return now < this.getTokenIssueDate() + this.config.expiresIn;
  }

  private getTokenIssueDate() {
    try {
      const token = this.getAccessToken();
      return jwtDecode(token).iat;
    } catch (err) {
      return undefined;
    }
  }
}
