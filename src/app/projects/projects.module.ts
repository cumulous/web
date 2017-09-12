import { NgModule } from '@angular/core';

import { SharedModule } from '../shared/shared.module';

import { ProjectListComponent } from './project-list.component';
import { ProjectDialogComponent } from './project-dialog.component';
import { ProjectsRoutingModule } from './projects-routing.module';

@NgModule({
  imports: [
    SharedModule,
    ProjectsRoutingModule,
  ],
  declarations: [
    ProjectListComponent,
    ProjectDialogComponent,
  ],
  entryComponents: [
    ProjectDialogComponent,
  ],
})
export class ProjectsModule { }
