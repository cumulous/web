import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';

@NgModule({
  imports: [
    CommonModule,
    NgxDatatableModule,
  ],
  exports: [
    CommonModule,
    NgxDatatableModule,
  ],
})

export class SharedModule { }
