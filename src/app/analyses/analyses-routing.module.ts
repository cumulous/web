import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AnalysisListComponent } from './analysis-list.component';

const routes: Routes = [
  { path: '', component: AnalysisListComponent },
];

@NgModule({
  imports: [
    RouterModule.forChild(routes),
  ],
  exports: [
    RouterModule,
  ],
})
export class AnalysesRoutingModule { }
