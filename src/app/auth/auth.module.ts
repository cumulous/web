import { NgModule, ModuleWithProviders } from '@angular/core';

import { AuthProviderService } from './auth-provider.service';
import { AuthProviderConfig } from './auth-provider.config';
import { AuthService } from './auth.service';
import { AuthGuardService } from './auth-guard.service';

import { CognitoAuthProviderService } from './cognito-auth-provider.service';

import { Configuration as ApiConfig } from '../api/configuration';

@NgModule({
  providers: [
    AuthService,
    AuthGuardService,
  ],
})
export class AuthModule {
  static forRoot(authProviderConfig: AuthProviderConfig, apiConfigFactory: () => ApiConfig): ModuleWithProviders {
    return {
      ngModule: AuthModule,
      providers: [
        { provide: AuthProviderService, useClass: CognitoAuthProviderService },
        { provide: AuthProviderConfig, useValue: authProviderConfig },
        { provide: ApiConfig, useFactory: apiConfigFactory },
      ],
    };
  }
}
