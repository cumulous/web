import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgModule } from '@angular/core';

import { ApiInterceptor } from './api.interceptor';
import { ApiService } from './api.service';

@NgModule({
  imports: [
    HttpClientModule,
  ],
  providers: [
    ApiService,
    { provide: HTTP_INTERCEPTORS, useClass: ApiInterceptor, multi: true },
  ],
})
export class ApiModule {}
