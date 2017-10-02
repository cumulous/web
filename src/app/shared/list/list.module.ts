import { NgModule } from '@angular/core';
import { MdButtonModule, MdToolbarModule } from '@angular/material';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';

import { ListViewComponent } from './list-view.component';

@NgModule({
  exports: [
    MdButtonModule,
    MdToolbarModule,
    NgxDatatableModule,
  ],
  declarations: [
    ListViewComponent,
  ],
})
export class ListModule {}
