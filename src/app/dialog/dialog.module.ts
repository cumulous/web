import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MdButtonModule, MdDialogModule, MdDialog, MdInputModule } from '@angular/material';

import { DialogActionsComponent } from './dialog-actions.component';

@NgModule({
  imports: [
    MdButtonModule,
    MdDialogModule,
  ],
  declarations: [
    DialogActionsComponent,
  ],
  providers: [
    MdDialog,
  ],
  exports: [
    DialogActionsComponent,
    MdButtonModule,
    MdDialogModule,
    MdInputModule,
    ReactiveFormsModule,
  ],
})
export class DialogModule { }
