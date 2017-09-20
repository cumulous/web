import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { DialogModule } from './dialog/dialog.module';
import { ListModule } from './list/list.module';
import { PipesModule } from './pipes/pipes.module';

@NgModule({
  exports: [
    CommonModule,
    DialogModule,
    ListModule,
    PipesModule,
  ],
})
export class SharedModule {}
