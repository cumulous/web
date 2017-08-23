import { NgModule, Optional, SkipSelf } from '@angular/core';
import { MdTabsModule } from '@angular/material';

import { ApiModule } from '../api/api.module';
import { Configuration as ApiConfig } from '../api/configuration';

import { AuthModule } from '../auth/auth.module';

import { LoginModule } from '../login/login.module';

import { environment } from '../../environments/environment';

@NgModule({
  imports: [
    ApiModule.forConfig(apiConfig),
    AuthModule.forRoot(environment.auth, apiConfig),
    MdTabsModule,
    LoginModule,
  ],
  exports: [
    MdTabsModule,
  ],
})
export class CoreModule {
  constructor (@Optional() @SkipSelf() parentModule: CoreModule) {
    if (parentModule) {
      throw new Error(
        'CoreModule is already loaded. Import it in the AppModule only');
    }
  }
}

export const apiKeys = {
  Authorization: undefined,
};

export function apiConfig() {
  return new ApiConfig({
    basePath: environment.apiRoot,
    withCredentials: true,
    apiKeys,
  });
}
