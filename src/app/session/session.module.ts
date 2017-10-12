import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material';

import { SessionComponent } from './session.component';

@NgModule({
  imports: [
    MatButtonModule,
  ],
  declarations: [
    SessionComponent,
  ],
  exports: [
    SessionComponent,
  ],
})
export class SessionModule {}
