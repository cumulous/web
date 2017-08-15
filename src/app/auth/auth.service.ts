import { Injectable } from '@angular/core';
import { CognitoAuth } from 'amazon-cognito-auth-js/dist/amazon-cognito-auth';

import { AuthConfig } from './auth.config';

@Injectable()
export class AuthService {
  private auth: CognitoAuth;

  constructor(config: AuthConfig) {
    this.auth = new CognitoAuth(config);
  }
}
