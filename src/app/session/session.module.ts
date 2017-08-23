import { NgModule } from '@angular/core';
import { MdButtonModule } from '@angular/material';

import { SessionComponent } from './session.component';

@NgModule({
  imports: [
    MdButtonModule,
  ],
  declarations: [
    SessionComponent,
  ],
  exports: [
    SessionComponent,
  ],
})
export class SessionModule {}
