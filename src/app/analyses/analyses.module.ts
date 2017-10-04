import { NgModule } from '@angular/core';

import { SharedModule } from '../shared/shared.module';

import { AnalysesRoutingModule } from './analyses-routing.module';

@NgModule({
  imports: [
    SharedModule,
    AnalysesRoutingModule,
  ],
})
export class AnalysesModule {}
