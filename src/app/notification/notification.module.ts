import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatSnackBarModule } from '@angular/material';

import { NotificationComponent } from './notification.component';
import { NotificationViewComponent } from './notification-view.component';

@NgModule({
  imports: [
    CommonModule,
    MatSnackBarModule,
  ],
  declarations: [
    NotificationComponent,
    NotificationViewComponent,
  ],
})
export class NotificationModule {}
