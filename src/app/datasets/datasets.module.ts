import { NgModule } from '@angular/core';

import { DatasetListComponent } from './dataset-list.component';
import { DatasetsRoutingModule } from './datasets-routing.module';

@NgModule({
  imports: [
    DatasetsRoutingModule,
  ],
  declarations: [
    DatasetListComponent,
  ],
})
export class DatasetsModule { }
