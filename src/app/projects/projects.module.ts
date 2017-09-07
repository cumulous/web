import { NgModule } from '@angular/core';

import { SharedModule } from '../shared/shared.module';

import { ProjectsComponent } from './projects.component';
import { ProjectListComponent } from './project-list.component';
import { ProjectsRoutingModule } from './projects-routing.module';

@NgModule({
  imports: [
    SharedModule,
    ProjectsRoutingModule,
  ],
  declarations: [
    ProjectsComponent,
    ProjectListComponent,
  ],
})
export class ProjectsModule { }
