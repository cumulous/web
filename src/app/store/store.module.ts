import { NgModule } from '@angular/core';

import { StoreModule as Store } from '@ngrx/store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';

import { reducers } from './reducers';
import { StoreService } from './store.service';

@NgModule({
  imports: [
    Store.forRoot(reducers),
    StoreDevtoolsModule.instrument({ maxAge: 25 }),
  ],
  providers: [
    StoreService,
  ],
})
export class StoreModule {}
