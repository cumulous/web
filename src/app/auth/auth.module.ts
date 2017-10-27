import { NgModule } from '@angular/core';

import { AuthService } from './auth.service';
import { AuthGuardService } from './auth-guard.service';

import { CognitoAuthService } from './cognito-auth.service';

@NgModule({
  providers: [
    AuthGuardService,
    { provide: AuthService, useClass: CognitoAuthService },
  ],
})
export class AuthModule {}
