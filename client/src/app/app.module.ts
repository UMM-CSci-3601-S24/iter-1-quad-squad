import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';

import { AppComponent } from './app.component';
import { HostComponent } from './host/host.component';

@NgModule({
  declarations: [],
  imports: [
    BrowserModule,
    HttpClientModule,
    HostComponent,
    AppComponent
  ],
  providers: [],
  bootstrap: []
})
export class AppModule { }
