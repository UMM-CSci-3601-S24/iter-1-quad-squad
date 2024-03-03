import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';

import { AppComponent } from './app.component';
import { HostComponent } from './host/host.component';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [],
  imports: [
    BrowserModule,
    HttpClientModule,
    HostComponent,
    AppComponent,
    FormsModule
  ],
  providers: [],
  bootstrap: []
})
export class AppModule { }
