import { Pipe, PipeTransform } from '@angular/core';

import { ProjectsCachingService } from '../../caching/projects-caching.service';

@Pipe({
  name: 'projectName',
})
export class ProjectNamePipe implements PipeTransform {

  constructor(private readonly projectsCachingService: ProjectsCachingService) {}

  transform(id: string) {
    return this.projectsCachingService.get(id)
      .map(project => project.name || project.id);
  }
}
