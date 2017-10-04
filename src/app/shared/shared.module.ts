import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { ItemsModule } from './items/items.module';
import { PipesModule } from './pipes/pipes.module';

@NgModule({
  exports: [
    CommonModule,
    ItemsModule,
    PipesModule,
  ],
})
export class SharedModule {}
