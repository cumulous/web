import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { DatasetListComponent } from './dataset-list.component';

const routes: Routes = [
  { path: 'datasets', component: DatasetListComponent },
];

@NgModule({
  imports: [
    RouterModule.forChild(routes),
  ],
  exports: [
    RouterModule,
  ],
})
export class DatasetsRoutingModule { }
