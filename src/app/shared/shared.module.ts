import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { DialogModule } from './dialog/dialog.module';
import { ListModule } from './list/list.module';

@NgModule({
  exports: [
    CommonModule,
    DialogModule,
    ListModule,
  ],
})
export class SharedModule {}
