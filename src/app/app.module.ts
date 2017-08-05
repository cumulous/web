import { NgModule } from '@angular/core';
import { MdTabsModule } from '@angular/material';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';

import { CoreModule } from './core/core.module';
import { DatasetsModule } from './datasets/datasets.module';

@NgModule({
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    MdTabsModule,
    CoreModule,
    DatasetsModule,
    AppRoutingModule,
  ],
  declarations: [
    AppComponent,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
