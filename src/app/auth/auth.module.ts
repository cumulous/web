import { NgModule, ModuleWithProviders } from '@angular/core';

import { AuthConfig } from './auth.config';
import { AuthService } from './auth.service';

@NgModule({
  providers: [ AuthService ],
})
export class AuthModule {
  public static forRoot(configFactory: () => AuthConfig): ModuleWithProviders {
    return {
      ngModule: AuthModule,
      providers: [ { provide: AuthConfig, useFactory: configFactory }]
    };
  }
}
