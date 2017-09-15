import { NgModule } from '@angular/core';
import { MdButtonModule, MdToolbarModule } from '@angular/material';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';

@NgModule({
  exports: [
    MdButtonModule,
    MdToolbarModule,
    NgxDatatableModule,
  ],
})
export class ListModule { }
