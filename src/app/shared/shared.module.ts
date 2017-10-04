import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { DialogModule } from './dialog/dialog.module';
import { ItemsModule } from './items/items.module';
import { ListModule } from './list/list.module';
import { PipesModule } from './pipes/pipes.module';

@NgModule({
  exports: [
    CommonModule,
    DialogModule,
    ItemsModule,
    ListModule,
    PipesModule,
  ],
})
export class SharedModule {}
