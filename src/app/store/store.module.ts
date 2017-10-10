import { NgModule } from '@angular/core';

import { RouterStateSerializer, StoreRouterConnectingModule } from '@ngrx/router-store';
import { StoreModule as Store } from '@ngrx/store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';

import { reducers } from './reducers';
import { RouterSerializer } from './router';
import { StoreService } from './store.service';

@NgModule({
  imports: [
    Store.forRoot(reducers),
    StoreDevtoolsModule.instrument({ maxAge: 25 }),
    StoreRouterConnectingModule,
  ],
  providers: [
    { provide: RouterStateSerializer, useClass: RouterSerializer },
    StoreService,
  ],
})
export class StoreModule {}
