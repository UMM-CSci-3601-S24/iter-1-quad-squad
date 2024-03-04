import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { HostComponent } from './host/host.component';
import { AddUserComponent } from './users/add-user.component';
import { UserListComponent } from './users/user-list.component';
import { UserProfileComponent } from './users/user-profile.component';
import { CompanyListComponent } from './company-list/company-list.component';
import { EditHuntComponent } from './hunt/edit-hunt.component';
import { AddTaskComponent } from './hunt/add-task.component';
import { CreateHuntComponent } from './create-hunt/create-hunt.component';

const routes: Routes = [
  { path: '', component: HomeComponent, title: 'Home' },
  { path: 'login', component: LoginComponent, title: 'Login' },
  { path: 'host', component: HostComponent, title: 'Host' },
  { path: 'task/new/:huntId', component: AddTaskComponent, title: 'Add Task' },
  { path: 'tasks/:huntId', component: EditHuntComponent }, // Route to view tasks for a hunt
  { path: 'users', component: UserListComponent, title: 'Users' },
  { path: 'users/new', component: AddUserComponent, title: 'Add User' },
  { path: 'users/:id', component: UserProfileComponent, title: 'User Profile' },
  { path: 'companies', component: CompanyListComponent, title: 'Companies' },
  { path: 'hunt/new', component: CreateHuntComponent, title: 'Create Hunt' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
