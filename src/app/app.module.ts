import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';

import { DatasetsModule } from './datasets/datasets.module';

@NgModule({
  imports: [
    BrowserModule,
    DatasetsModule,
    AppRoutingModule,
  ],
  declarations: [
    AppComponent,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
