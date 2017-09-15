import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MdButtonModule, MdDialogModule, MdDialog, MdInputModule } from '@angular/material';

@NgModule({
  providers: [
    MdDialog,
  ],
  exports: [
    MdButtonModule,
    MdDialogModule,
    MdInputModule,
    ReactiveFormsModule,
  ],
})
export class DialogModule { }
