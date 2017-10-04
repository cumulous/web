import { NgModule } from '@angular/core';

import { ListModule } from '../list/list.module';
import { ToolbarModule } from '../toolbar/toolbar.module';

import { ItemsPageComponent } from './items-page.component';

@NgModule({
  imports: [
    ListModule,
    ToolbarModule,
  ],
  declarations: [
    ItemsPageComponent,
  ],
})
export class ItemsModule {}
