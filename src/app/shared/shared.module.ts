import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';

import { DialogModule } from '../dialog/dialog.module';

@NgModule({
  exports: [
    CommonModule,
    NgxDatatableModule,
    DialogModule,
  ],
})
export class SharedModule { }
