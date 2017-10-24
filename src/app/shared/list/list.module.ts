import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatProgressSpinnerModule } from '@angular/material';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';

import { ListComponent } from './list.component';
import { ListViewComponent } from './list-view.component';

@NgModule({
  imports: [
    CommonModule,
    MatProgressSpinnerModule,
    NgxDatatableModule,
  ],
  declarations: [
    ListComponent,
    ListViewComponent,
  ],
  exports: [
    ListComponent,
  ],
})
export class ListModule {}
