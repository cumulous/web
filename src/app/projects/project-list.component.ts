import { Component, ElementRef, OnInit } from '@angular/core';
import { MdDialog } from '@angular/material';

import { ProjectsService } from '../api/api/projects.service';
import { Project } from '../api/model/project';

import { ListBaseComponent, ListColumn } from '../shared/list/list-base.component';

import { ProjectDialogComponent } from './project-dialog.component';

@Component({
  selector: 'app-project-list',
  templateUrl: '../shared/list/list-base.component.html',
})
export class ProjectListComponent extends ListBaseComponent<Project> implements OnInit {
  constructor(dialog: MdDialog, private projectsService: ProjectsService) {
    super(dialog, ProjectDialogComponent);
  }

  ngOnInit() {
    this.columns.push(
      new ListColumn('name'),
      new ListColumn('description'),
      new ListColumn('created_at', 'Date Created', this.dateTemplate),
      new ListColumn('status'),
    );
    super.ngOnInit();
  }

  protected list(offset: number, limit: number) {
    return this.projectsService.listProjects(
      undefined, undefined, undefined, undefined, undefined, undefined, offset, limit);
  }
}
