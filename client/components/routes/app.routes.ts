import {provideRouter, RouterConfig} from '@angular/router';
import {LoginComponent} from '../login/login.component';
import {RegisterComponent} from '../register/register.component';
import {TodoListComponent} from '../todos/todolist.component';
import {EditUserComponent} from '../edituser/edituser.component';

export const routes: RouterConfig = [
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'todos', component: TodoListComponent },
  { path: 'editprofile', component: EditUserComponent },
  { path: '**', component: LoginComponent }
];

export const APP_ROUTER_PROVIDERS = [
  provideRouter(routes)
];