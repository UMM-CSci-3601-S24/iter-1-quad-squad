import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { HostComponent } from './host/host.component';

import { EditHuntComponent } from './hunt/edit-hunt.component';
import { AddTaskComponent } from './hunt/add-task.component';
import { CreateHuntComponent } from './create-hunt/create-hunt.component';

// Note that the 'users/new' route needs to come before 'users/:id'.
// If 'users/:id' came first, it would accidentally catch requests to
// 'users/new'; the router would just think that the string 'new' is a user ID.
const routes: Routes = [
  {path: '', component: HomeComponent, title: 'Home'},
  {path: 'login', component: LoginComponent, title: 'Login'},
  // {path: 'hunts', component: seeHuntComponent}, to be implemented, where a user can sees all their hunts
  // {path: 'hunt/:id', component: editHuntComponent}, to be implemented, page that you can see all tasks in a hunt and edit them
  {path: 'host', component: HostComponent, title: 'Host'},
  {path: 'task/:huntId', component: EditHuntComponent}, //the id here is the hunt id from which all of the tasks displayed belong to
  {path: 'task/new/:huntId', component: AddTaskComponent, title: 'Add Task'},
  {path: 'hunt/new', component: CreateHuntComponent, title: 'Create a Hunt'}


];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
