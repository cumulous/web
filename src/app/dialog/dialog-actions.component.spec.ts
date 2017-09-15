import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, FormGroup } from '@angular/forms';
import { MdDialogRef } from '@angular/material';

import { selectElement } from '../../testing';

import { DialogModule } from './dialog.module';
import { DialogActionsComponent } from './dialog-actions.component';

describe('DialogActionsComponent', () => {
  const fakeAction = 'Fake action';

  let fixture: ComponentFixture<DialogActionsComponent>;
  let component: DialogActionsComponent;
  let dialog: jasmine.Spy;
  let form: FormGroup;
  let submit: HTMLButtonElement;

  beforeEach(() => {
    dialog = jasmine.createSpy('MdDialogRef');

    TestBed.configureTestingModule({
      imports: [
        DialogModule,
      ],
      providers: [
        { provide: MdDialogRef, useValue: dialog },
      ]
    });

    fixture = TestBed.createComponent(DialogActionsComponent);
    component = fixture.componentInstance;
    submit = selectElement(fixture, 'button[type="submit"]');

    form = new FormGroup({
      name: new FormControl(),
    });
    component.form = form;

    component.action = fakeAction;
  });

  it('sets "submit" button text to the value of "action" input', () => {
    fixture.detectChanges();
    expect(submit.textContent.trim()).toBe(fakeAction);
  });

  describe('disables "submit" button', () => {
    it('initially', () => {
      expect(form.pristine).toBe(true);
    });
    it('if form is invalid', () => {
      form.setErrors({
        valid: false,
      });
      expect(form.invalid).toBe(true);
    });
    afterEach(() => {
      fixture.detectChanges();
      expect(submit.disabled).toBeTruthy();
    });
  });

  it('enables "submit" button if form is dirty but valid', () => {
    form.markAsDirty();
    fixture.detectChanges();

    expect(form.dirty).toBe(true);
    expect(form.valid).toBe(true);
    expect(submit.disabled).toBeFalsy();
  });
});
