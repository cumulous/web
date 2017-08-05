import { NgModule } from '@angular/core';

import { SharedModule } from '../shared/shared.module';
import { AnalysisListComponent } from './analysis-list.component';
import { AnalysesRoutingModule } from './analyses-routing.module';

@NgModule({
  imports: [
    SharedModule,
    AnalysesRoutingModule,
  ],
  declarations: [
    AnalysisListComponent,
  ],
})
export class AnalysesModule { }
