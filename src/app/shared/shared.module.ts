import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { MdButtonModule, MdDialogModule, MdDialog, MdInputModule } from '@angular/material';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';

@NgModule({
  exports: [
    CommonModule,
    NgxDatatableModule,
    ReactiveFormsModule,
    MdDialogModule,
    MdInputModule,
    MdButtonModule,
  ],
  providers: [
    MdDialog,
  ],
})
export class SharedModule { }
