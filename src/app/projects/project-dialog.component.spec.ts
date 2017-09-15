import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder, FormGroup } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { MD_DIALOG_DATA, MdDialogRef } from '@angular/material';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';

import * as uuid from 'uuid';

import { dispatchEvent } from '../../testing';

import { SharedModule } from '../shared/shared.module';

import { ProjectDialogComponent } from './project-dialog.component';

import { Project } from '../api/model/project';
import { ProjectStatus } from '../api/model/projectStatus';
import { ProjectsService } from '../api/api/projects.service';

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

  let spyOnFormGroup: jasmine.Spy;
  let spyOnUpdateProject: jasmine.Spy;

  beforeEach(() => {
    dialog = jasmine.createSpyObj('MdDialogRef', ['close']);

    TestBed.configureTestingModule({
      imports: [
        SharedModule,
        NoopAnimationsModule,
        HttpModule,
      ],
      declarations: [
        ProjectDialogComponent,
      ],
      providers: [
        FormBuilder,
        { provide: MdDialogRef, useValue: dialog },
        { provide: MD_DIALOG_DATA, useValue: fakeProject() },
        ProjectsService,
      ],
    });

    spyOnFormGroup = spyOn(FormBuilder.prototype, 'group').and.callThrough();

    fixture = TestBed.createComponent(ProjectDialogComponent);
    component = fixture.componentInstance;
    form = component.form;

    const projectsService = fixture.debugElement.injector.get(ProjectsService);
    spyOnUpdateProject = spyOn(projectsService, 'updateProject')
      .and.returnValue(Observable.of({}));

    fixture.detectChanges();
  });

  it('calls FromBuilder.group() once with correct parameters', () => {
    expect(spyOnFormGroup).toHaveBeenCalledTimes(1);
    expect(spyOnFormGroup).toHaveBeenCalledWith({
      id: { value: fakeProjectId, disabled: true },
      name: fakeProjectName,
      description: fakeProjectDescription,
      created_at: { value: fakeProjectDate, disabled: true },
      created_by: { value: fakeCreatedBy, disabled: true },
      status: { value: fakeProjectStatus, disabled: true },
    });
  });

  it('calls projectsService.updateProject() once with correct parameters on "submit" event', () => {
    const updatedValues = () => ({
      name: fakeProjectName + ' (updated)',
      description: fakeProjectDescription + ' (updated)',
    });
    form.patchValue(updatedValues());
    dispatchEvent(fixture, 'form', 'submit');
    expect(spyOnUpdateProject).toHaveBeenCalledWith(fakeProjectId, updatedValues());
  });
});
