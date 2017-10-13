import { NgModule } from '@angular/core';

import { RouterStateSerializer, StoreRouterConnectingModule } from '@ngrx/router-store';
import { StoreModule as StoreProviderModule } from '@ngrx/store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';

import { Store } from './models';
import { metaReducers, reducers } from './reducers';
import { RouterSerializer } from './router';

@NgModule({
  imports: [
    StoreProviderModule.forRoot(reducers, { metaReducers }),
    StoreDevtoolsModule.instrument({ maxAge: 25 }),
    StoreRouterConnectingModule,
  ],
  providers: [
    { provide: RouterStateSerializer, useClass: RouterSerializer },
    Store,
  ],
})
export class StoreModule {}
