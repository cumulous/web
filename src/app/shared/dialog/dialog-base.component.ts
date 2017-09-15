import { FormBuilder, FormGroup } from '@angular/forms';
import { Response } from '@angular/http';
import { MdDialogRef } from '@angular/material';

import { Observable } from 'rxjs/Observable';

export abstract class DialogBaseComponent<Item> {
  private readonly formGroup: FormGroup;
  private errorsDict: { [key: string]: string };
  private isWaiting: boolean;

  constructor(
        private readonly dialog: MdDialogRef<DialogBaseComponent<Item>>,
        formBuilder: FormBuilder,
        item: Item
      ) {
    this.formGroup = this.createForm(formBuilder, item);
  }

  get form() {
    return this.formGroup;
  }

  protected abstract createForm(formBuilder: FormBuilder, item: Item): FormGroup;
  protected abstract create(): Observable<Item>;
  protected abstract update(): Observable<Item>;

  get waiting() {
    return this.isWaiting;
  }

  onSubmit() {
    this.isWaiting = true;
    (this.form.get('id').value ? this.update() : this.create())
      .subscribe(
        item => this.onSuccess(item),
        err => this.onError(err),
      );
  }

  private onSuccess(item: Item) {
    this.dialog.close(item);
  }

  private onError(err: Response) {
    this.isWaiting = false;
    this.errorsDict = {};
    if (err == null || typeof err.json !== 'function') {
      return;
    }
    const response = err.json();
    if (response == null) {
      return;
    }
    const errors = response.errors;
    if (!Array.isArray(errors)) {
      return;
    }
    errors.forEach(error => {
      const match = error.match(/^body.(\S+)\s+(.*)/);
      if (match != null) {
        const control = this.form.get(match[1]);
        if (control != null) {
          control.setErrors({
            api: true,
          });
          this.errorsDict[match[1]] = match[2];
        }
      }
    });
  }

  get errors(): { [key: string]: string } {
    return Object.assign({}, this.errorsDict);
  }
}
