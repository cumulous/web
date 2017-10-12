import { NgModule } from '@angular/core';
import { MatButtonModule, MatToolbarModule } from '@angular/material';

import { ToolbarComponent } from './toolbar.component';

@NgModule({
  imports: [
    MatButtonModule,
    MatToolbarModule,
  ],
  declarations: [
    ToolbarComponent,
  ],
  exports: [
    ToolbarComponent,
  ],
})
export class ToolbarModule { }
