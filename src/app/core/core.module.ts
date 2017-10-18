import { NgModule, Optional, SkipSelf } from '@angular/core';
import { MatTabsModule } from '@angular/material';

import { ApiModule } from '../api/api.module';
import { Configuration as ApiConfig } from '../api/configuration';

import 'rxjs/add/observable/of';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/first';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/mergeMap';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/withLatestFrom';

import { AuthModule } from '../auth/auth.module';
import { LoginModule } from '../login/login.module';
import { SessionModule } from '../session/session.module';
import { StoreModule } from '../store/store.module';

import { environment } from '../../environments/environment';

@NgModule({
  imports: [
    ApiModule.forConfig(apiConfig),
    AuthModule,
    LoginModule,
    StoreModule,
  ],
  exports: [
    MatTabsModule,
    SessionModule,
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

export function apiConfig() {
  return new ApiConfig({
    basePath: environment.apiRoot,
    apiKeys: {
      Authorization: undefined,
    },
  });
}
