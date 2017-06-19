import { NgModule, Optional, SkipSelf } from '@angular/core';

import { ApiModule } from '../api/api.module';
import { Configuration as ApiConfig } from '../api/configuration';

import { environment } from '../../environments/environment';

@NgModule({
  imports: [ ApiModule.forConfig(apiConfig) ],
})
export class CoreModule {
  constructor (@Optional() @SkipSelf() parentModule: CoreModule) {
    if (parentModule) {
      throw new Error(
        'CoreModule is already loaded. Import it in the AppModule only');
    }
  }
}

export function apiConfig() {
  return new ApiConfig({
    basePath: environment.apiRoot,
    apiKeys: {
      Authorization: localStorage.getItem('accessToken'),
    },
    withCredentials: true,
  });
}
