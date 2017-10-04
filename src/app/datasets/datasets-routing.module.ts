import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ItemsPageComponent } from '../shared/items/items-page.component';

const routes: Routes = [
  { path: '', component: ItemsPageComponent, data: { type: 'datasets' } },
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
