import { NgModule } from '@angular/core';
import { MdButtonModule, MdToolbarModule } from '@angular/material';

import { ToolbarComponent } from './toolbar.component';

@NgModule({
  imports: [
    MdButtonModule,
    MdToolbarModule,
  ],
  declarations: [
    ToolbarComponent,
  ],
  exports: [
    ToolbarComponent,
  ],
})
export class ToolbarModule { }
