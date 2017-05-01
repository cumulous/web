import { NgModule } from '@angular/core';

import { SharedModule } from '../shared/shared.module';
import { DatasetListComponent } from './dataset-list.component';
import { DatasetsRoutingModule } from './datasets-routing.module';

@NgModule({
  imports: [
    SharedModule,
    DatasetsRoutingModule,
  ],
  declarations: [
    DatasetListComponent,
  ],
})
export class DatasetsModule { }
