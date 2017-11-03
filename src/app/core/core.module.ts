import { NgModule, Optional, SkipSelf } from '@angular/core';
import { MatTabsModule } from '@angular/material';

import { ApiModule } from '../api/api.module';
import { AuthModule } from '../auth/auth.module';
import { LoginModule } from '../login/login.module';
import { NotificationModule } from '../notification/notification.module';
import { SessionModule } from '../session/session.module';
import { StoreModule } from '../store/store.module';

import './rxjs';

@NgModule({
  imports: [
    ApiModule,
    AuthModule,
    LoginModule,
    NotificationModule,
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
