import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { AppComponent } from './app.component';
import { HostComponent } from './host/host.component';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

@NgModule({
  declarations: [],
  imports: [
    BrowserModule,
    HttpClientModule,
    HostComponent,
    AppComponent,
    FormsModule,
    RouterModule
  ],
  providers: [HttpClient],
  bootstrap: []
})
export class AppModule { }
