import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MdButtonModule, MdDialogModule, MdDialog,
         MdInputModule, MdProgressSpinnerModule } from '@angular/material';

import { DialogActionsComponent } from './dialog-actions.component';

@NgModule({
  imports: [
    CommonModule,
    MdButtonModule,
    MdDialogModule,
    MdProgressSpinnerModule,
  ],
  declarations: [
    DialogActionsComponent,
  ],
  providers: [
    MdDialog,
  ],
  exports: [
    DialogActionsComponent,
    MdDialogModule,
    MdInputModule,
    ReactiveFormsModule,
  ],
})
export class DialogModule {}
