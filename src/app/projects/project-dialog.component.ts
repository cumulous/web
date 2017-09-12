import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MD_DIALOG_DATA, MdDialogRef } from '@angular/material';

import { Project } from '../api/model/project';

@Component({
  templateUrl: './project-dialog.component.html',
})
export class ProjectDialogComponent {
  form: FormGroup;

  constructor(
        private readonly formBuilder: FormBuilder,
        private readonly dialog: MdDialogRef<ProjectDialogComponent>,
        @Inject(MD_DIALOG_DATA) private project: Project,
      ) {
    this.createForm();
  }

  createForm() {
    this.form = this.formBuilder.group({
      id: { value: this.project.id, disabled: true },
      name: [ this.project.name, Validators.required ],
      description: this.project.description,
      created_at: { value: this.project.created_at, disabled: true },
      created_by: { value: this.project.created_by, disabled: true },
      status: { value: this.project.status, disabled: true },
    });
  }

  onSubmit() {
    this.dialog.close(this.form.value);
  }
}
