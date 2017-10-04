import { NgModule } from '@angular/core';

import { SharedModule } from '../shared/shared.module';

import { DatasetsRoutingModule } from './datasets-routing.module';

@NgModule({
  imports: [
    SharedModule,
    DatasetsRoutingModule,
  ],
})
export class DatasetsModule {}
