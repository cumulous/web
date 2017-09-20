import { Component, Inject } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MD_DIALOG_DATA, MdDialogRef } from '@angular/material';

import 'rxjs/add/operator/do';

import { DialogBaseComponent } from '../shared/dialog/dialog-base.component';

import { ProjectsService } from '../api/api/projects.service';
import { Project } from '../api/model/project';
import { ProjectsCachingService } from '../caching/projects-caching.service';

@Component({
  templateUrl: './project-dialog.component.html',
})
export class ProjectDialogComponent extends DialogBaseComponent<Project> {
  constructor(
        dialog: MdDialogRef<ProjectDialogComponent>,
        formBuilder: FormBuilder,
        @Inject(MD_DIALOG_DATA) project: Project,
        private readonly projectsService: ProjectsService,
        private readonly projectsCachingService: ProjectsCachingService,
      ) {
    super(dialog, formBuilder, project);
  }

  protected createForm(formBuilder: FormBuilder, project: Project) {
    return formBuilder.group({
      id: { value: project.id, disabled: true },
      name: project.name,
      description: project.description,
      created_at: { value: project.created_at, disabled: true },
      created_by: { value: project.created_by, disabled: true },
      status: { value: project.status, disabled: true },
    });
  }

  protected create() {
    return this.projectsService.createProject(
      this.form.value,
    ).do(project => this.cache(project));
  }

  protected update() {
    return this.projectsService.updateProject(
      this.form.get('id').value, this.form.value,
    ).do(project => this.cache(project));
  }

  private cache(project: Project) {
    this.projectsCachingService.update(project);
  }
}
