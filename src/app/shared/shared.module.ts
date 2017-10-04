import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { DialogModule } from './dialog/dialog.module';
import { ItemsModule } from './items/items.module';
import { PipesModule } from './pipes/pipes.module';

@NgModule({
  exports: [
    CommonModule,
    DialogModule,
    ItemsModule,
    PipesModule,
  ],
})
export class SharedModule {}
