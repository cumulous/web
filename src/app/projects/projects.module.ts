import { NgModule } from '@angular/core';

import { SharedModule } from '../shared/shared.module';

import { ProjectsRoutingModule } from './projects-routing.module';

@NgModule({
  imports: [
    SharedModule,
    ProjectsRoutingModule,
  ],
})
export class ProjectsModule {}
