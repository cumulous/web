import { Injectable } from '@angular/core';

import { CachingBaseService } from './caching-base.service';

import { ProjectsService } from '../api/api/projects.service';
import { Project } from '../api/model/project';

@Injectable()
export class ProjectsCachingService extends CachingBaseService<Project> {

  constructor(private readonly projectsService: ProjectsService) {
    super();
    this.initCache();
  }

  protected listItems(offset?: number, limit?: number) {
    return this.projectsService.listProjects(
      undefined, undefined, undefined, undefined, undefined, undefined,
      offset, limit,
    );
  }
}
