import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MdDialogModule, MdDialog } from '@angular/material';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';

@NgModule({
  exports: [
    CommonModule,
    NgxDatatableModule,
    MdDialogModule,
  ],
  providers: [
    MdDialog,
  ],
})
export class SharedModule { }
