import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MD_DIALOG_DATA, MdDialogRef } from '@angular/material';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

import * as uuid from 'uuid';

import { dispatchEvent, selectElement } from '../../testing';

import { SharedModule } from '../shared/shared.module';

import { ProjectsModule } from './projects.module';
import { ProjectDialogComponent } from './project-dialog.component';

import { Project } from '../api/model/project';
import { ProjectStatus } from '../api/model/projectStatus';

describe('ProjectDialogComponent', () => {
  const now = new Date().getTime();

  const fakeProjectId = uuid();
  const fakeProjectName = 'Fake Project';
  const fakeProjectDescription = 'Fake project description';
  const fakeProjectDate = new Date(now - 1E9).toString();
  const fakeCreatedBy = uuid();
  const fakeProjectStatus = ProjectStatus.Active;

  const fakeProject = (): Project => ({
    id: fakeProjectId,
    name: fakeProjectName,
    created_by: fakeCreatedBy,
    created_at: fakeProjectDate,
    description: fakeProjectDescription,
    status: ProjectStatus.Active,
  });

  let fixture: ComponentFixture<ProjectDialogComponent>;
  let component: ProjectDialogComponent;
  let dialog: MdDialogRef<ProjectDialogComponent>;
  let form: FormGroup;
  let submit: HTMLButtonElement;

  let spyOnFormGroup: jasmine.Spy;

  beforeEach(() => {
    dialog = jasmine.createSpyObj('MdDialogRef', ['close']);

    TestBed.configureTestingModule({
      imports: [
        SharedModule,
        NoopAnimationsModule,
      ],
      declarations: [
        ProjectDialogComponent,
      ],
      providers: [
        FormBuilder,
        { provide: MdDialogRef, useValue: dialog },
        { provide: MD_DIALOG_DATA, useValue: fakeProject() },
      ],
    });

    spyOnFormGroup = spyOn(FormBuilder.prototype, 'group').and.callThrough();

    fixture = TestBed.createComponent(ProjectDialogComponent);
    component = fixture.componentInstance;
    form = component.form;
    submit = selectElement(fixture, 'button[type="submit"]');

    fixture.detectChanges();
  });

  it('calls FromBuilder.group() once with correct parameters', () => {
    expect(spyOnFormGroup).toHaveBeenCalledTimes(1);
    expect(spyOnFormGroup).toHaveBeenCalledWith({
      id: { value: fakeProjectId, disabled: true },
      name: [fakeProjectName, Validators.required ],
      description: fakeProjectDescription,
      created_at: { value: fakeProjectDate, disabled: true },
      created_by: { value: fakeCreatedBy, disabled: true },
      status: { value: fakeProjectStatus, disabled: true },
    });
  });

  it('initializes "form" with correct values', () => {
    expect(form.getRawValue()).toEqual({
      id: fakeProjectId,
      name: fakeProjectName,
      description: fakeProjectDescription,
      created_at: fakeProjectDate,
      created_by: fakeCreatedBy,
      status: fakeProjectStatus,
    });
    expect(form.value).toEqual({
      name: fakeProjectName,
      description: fakeProjectDescription,
    });
  });

  describe('disables "submit" button', () => {
    it('initially', () => {
      expect(form.pristine).toBe(true);
    });
    it('if project name is empty', () => {
      form.patchValue({
        name: '',
      });
      expect(form.valid).toBe(false);
      dispatchEvent(fixture, 'input[formControlName="name"]', 'input');
    });
    afterEach(() => {
      expect(submit.disabled).toBeTruthy();
    });
  });

  describe('enables "submit" button if', () => {
    it('project name has been updated in the form', () => {
      form.patchValue({
        name: fakeProjectName + ' (updated)',
      });
      dispatchEvent(fixture, 'input[formControlName="name"]', 'input');
    });
    it('project description has been updated in the form', () => {
      form.patchValue({
        description: fakeProjectDescription + ' (updated)',
      });
      dispatchEvent(fixture, 'textarea[formControlName="description"]', 'input');
    });
    afterEach(() => {
      expect(form.valid).toBe(true);
      expect(submit.disabled).toBeFalsy();
    });
  });

  it('closes the dialog with updated form values on (submit) event', () => {
    const updatedValues = () => ({
      name: fakeProjectName + ' (updated)',
      description: fakeProjectDescription + ' (updated)',
    });
    form.patchValue(updatedValues());
    dispatchEvent(fixture, 'form', 'submit');
    expect(dialog.close).toHaveBeenCalledWith(updatedValues());
  });
});
