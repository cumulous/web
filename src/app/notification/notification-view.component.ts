import { Component, Input, OnChanges, OnDestroy } from '@angular/core';
import { MatSnackBar } from '@angular/material';

enum NotificationClass {
  error,
  warning,
  info,
};

@Component({
  selector: 'app-notification',
  template: '',
})
export class NotificationViewComponent implements OnChanges, OnDestroy {

  @Input() text?: string;
  @Input() class?: string;

  constructor(
    private readonly snackBar: MatSnackBar,
  ) {}

  ngOnChanges() {
    setTimeout(() => { // the only workaround for angular/angular #15634 that works
      if (this.text === undefined) {
        this.snackBar.dismiss();
      } else {
        this.snackBar.open(this.text, 'Dismiss', {
          extraClasses: this.classes,
        });
      }
    });
  }

  get classes() {
    if (this.class && this.class in NotificationClass) {
      return [this.class];
    } else {
      return undefined;
    }
  }

  ngOnDestroy() {
    this.snackBar.dismiss();
  }
}
