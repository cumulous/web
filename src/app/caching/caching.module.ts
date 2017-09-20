import { NgModule } from '@angular/core';

import { ProjectsCachingService } from './projects-caching.service';

@NgModule({
  providers: [
    ProjectsCachingService,
  ],
})
export class CachingModule {}
