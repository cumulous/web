import { NgModule } from '@angular/core';

import { ProjectNamePipe } from './project-name.pipe';

@NgModule({
  declarations: [
    ProjectNamePipe,
  ],
  exports: [
    ProjectNamePipe,
  ],
})
export class PipesModule {}
