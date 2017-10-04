import { NgModule } from '@angular/core';

import { ItemsModule } from './items/items.module';

@NgModule({
  exports: [
    ItemsModule,
  ],
})
export class SharedModule {}
