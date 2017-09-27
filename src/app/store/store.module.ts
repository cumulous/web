import { NgModule } from '@angular/core';

import { StoreModule as Store } from '@ngrx/store';

import { reducers } from './reducers';

@NgModule({
  imports: [
    Store.forRoot(reducers),
  ],
})
export class StoreModule {}
