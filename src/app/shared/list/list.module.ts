import { NgModule } from '@angular/core';
import { MdButtonModule, MdToolbarModule } from '@angular/material';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';

import { ListComponent } from './list.component';
import { ListViewComponent } from './list-view.component';

@NgModule({
  exports: [
    MdButtonModule,
    MdToolbarModule,
    NgxDatatableModule,
  ],
  declarations: [
    ListViewComponent,
    ListComponent,
  ],
  exports: [
    ListComponent,
  ],
})
export class ListModule {}
