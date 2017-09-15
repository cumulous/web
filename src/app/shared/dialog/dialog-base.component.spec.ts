import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MdDialogRef } from '@angular/material';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';

import * as uuid from 'uuid';

import { DialogBaseComponent } from './dialog-base.component';

const fakeItemId = uuid();
const fakeItemName = 'Fake item';
const fakeItemDescription = 'Fake item description';

interface Item {
  id: string;
  name: string;
  description?: string;
}

const fakeItem = () => ({
  id: fakeItemId,
  name: fakeItemName,
  description: fakeItemDescription,
});

@Component({
  template: '',
})
class ItemDialogComponent extends DialogBaseComponent<Item> {
  constructor(dialog: MdDialogRef<ItemDialogComponent>, formBuilder: FormBuilder) {
    super(dialog, formBuilder, fakeItem());
  }

  createForm(formBuilder: FormBuilder, item: Item) {
    return formBuilder.group({
      id: { value: fakeItemId, disabled: true },
      name: fakeItemName,
      description: fakeItemDescription,
    });
  }

  create() {
    return Observable.of(fakeItem());
  }

  update() {
    return Observable.of(fakeItem());
  }
}

describe('DialogBaseComponent', () => {
  let fixture: ComponentFixture<ItemDialogComponent>;
  let component: ItemDialogComponent;
  let dialog: MdDialogRef<ItemDialogComponent>;
  let formBuilder: FormBuilder;
  let form: FormGroup;

  const testPrep = () => {
    dialog = jasmine.createSpyObj('MdDialogRef', ['close']);
    formBuilder = new FormBuilder();

    TestBed.configureTestingModule({
      declarations: [
        ItemDialogComponent,
      ],
      providers: [
        { provide: MdDialogRef, useValue: dialog },
        { provide: FormBuilder, useValue: formBuilder },
      ],
    });

    fixture = TestBed.createComponent(ItemDialogComponent);
    component = fixture.componentInstance;
    form = component.form;
  };

  describe('constructor', () => {
    let spyOnForm: jasmine.Spy;
    let spyOnCreateForm: jasmine.Spy;

    beforeEach(() => {
      spyOnForm = jasmine.createSpy('FormGroup');
      spyOnCreateForm = spyOn(ItemDialogComponent.prototype, 'createForm')
        .and.returnValue(spyOnForm);
      testPrep();
    });

    it('calls createForm() with correct parameters', () => {
      expect(spyOnCreateForm).toHaveBeenCalledWith(formBuilder, fakeItem());
    });

    it('initializes form with the output of createForm()', () => {
      expect(form).toBe(spyOnForm);
    });
  });

  describe('onSubmit()', () => {
    let spyOnCreate: jasmine.Spy;
    let spyOnUpdate: jasmine.Spy;

    beforeEach(() => {
      testPrep();
      spyOnCreate = jasmine.createSpyObj('create', ['subscribe']);
      spyOn(component, 'create').and.returnValue(spyOnCreate);
      spyOnUpdate = jasmine.createSpyObj('update', ['subscribe']);
      spyOn(component, 'update').and.returnValue(spyOnUpdate);
    });

    it('sets "loading" to "true"', () => {
      component.onSubmit();
      expect(component.waiting).toBe(true);
    });

    it('calls update() once if "id" value is defined', () => {
      component.onSubmit();
      expect(component.update).toHaveBeenCalledTimes(1);
      expect(component.create).not.toHaveBeenCalled();
    });

    it('calls create() once if "id" value is defined', () => {
      form.patchValue({
        id: undefined,
      });
      component.onSubmit();
      expect(component.create).toHaveBeenCalledTimes(1);
      expect(component.update).not.toHaveBeenCalled();
    });

    it('closes dialog with correct parameters on successful update()', () => {
      const updatedItem = () => ({
        id: fakeItemId,
        name: fakeItemName + ' (updated)',
        description: fakeItemDescription + ' (updated)',
      });
      (spyOnUpdate as any).subscribe.and.callFake(onSuccess => onSuccess(updatedItem()));
      component.onSubmit();
      expect(dialog.close).toHaveBeenCalledWith(updatedItem());
    });

    it('closes dialog with correct parameters on successful create()', () => {
      form.patchValue({
        id: undefined,
      });
      (spyOnCreate as any).subscribe.and.callFake(onSuccess => onSuccess(fakeItem()));
      component.onSubmit();
      expect(dialog.close).toHaveBeenCalledWith(fakeItem());
    });

    describe('causes errors from unsuccessful', () => {
      const fakeNameError = 'Fake name error';
      const fakeDescriptionError = 'Fake description error';
      const fakeErrors = () => [
        'body.name ' + fakeNameError,
        'body.description ' + fakeDescriptionError,
        'body.extra error for an unsupported control',
        'some other error',
      ];

      const testErrors = (spyOnAction: () => any) => {
        let err: any;

        beforeEach(() => {
          err = {
            json: () => ({
              errors: fakeErrors(),
            }),
          };
          spyOnAction().subscribe
            .and.callFake((onSuccess, onError) => onError(err));
          component.onSubmit();
        });

        it('to be stored correctly and immutably', () => {
          component.errors['name'] = 'wrong error';
          expect(component.errors).toEqual({
            name: fakeNameError,
            description: fakeDescriptionError,
          });
        });

        it('to set error status of the corresponding controls', () => {
          expect(form.get('name').errors).toBeTruthy();
          expect(form.get('description').errors).toBeTruthy();
          expect(form.get('id').errors).toBeFalsy();
        });

        it('not to close the dialog', () => {
          expect(dialog.close).not.toHaveBeenCalled();
        });

        describe('not to be stored if', () => {
          it('response is undefined', () => err = undefined);
          it('response.json() is not a function', () => {
            err = {
              json: {},
            };
          });
          it('response.json() produces undefined result', () => {
            err = {
              json: () => {},
            };
          });
          it('their list is undefined', () => {
            err = {
              json: () => ({}),
            };
          });
          it('their list is empty', () => {
            err = {
              json: () => ({
                errors: [],
              }),
            };
          });
          afterEach(() => {
            component.onSubmit();
            expect(component.errors).toEqual({});
          });
        });

        it('to set "loading" to "false"', () => {
          component.onSubmit();
          expect(component.waiting).toBe(false);
        });
      };

      describe('create()', () => {
        testErrors(() => {
          form.patchValue({
            id: undefined,
          });
          return spyOnCreate;
        });
      });

      describe('update()', () => {
        testErrors(() => spyOnUpdate);
      });
    });
  });
});
