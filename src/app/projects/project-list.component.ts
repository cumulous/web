import { Component, ElementRef, OnInit } from '@angular/core';
import { MdDialog } from '@angular/material';

import { ProjectsService } from '../api/api/projects.service';
import { Project } from '../api/model/project';

import { ListBaseComponent, ListColumn } from '../shared/list-base.component';

@Component({
  selector: 'app-project-list',
  templateUrl: '../shared/list-base.component.html',
})
export class ProjectListComponent extends ListBaseComponent<Project> implements OnInit {

  constructor(
        private projectsService: ProjectsService,
        element: ElementRef,
        dialog: MdDialog,
      ) {
    super(element, dialog);
  }

  ngOnInit() {
    this.columns.push(
      new ListColumn('name'),
      new ListColumn('description'),
      new ListColumn('created_at', 'Date Created', this.dateTemplate, 'item-date'),
      new ListColumn('status'),
    );
    super.ngOnInit();
  }

  protected list(offset: number, limit: number) {
    return this.projectsService.listProjects(
      undefined, undefined, undefined, undefined, undefined, undefined, offset, limit);
  }
}
