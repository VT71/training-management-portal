import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';

export const routes: Routes = [
  {
    path: '',
    component: LoginComponent,
    title: 'Home page',
  },
  {
    path: 'login',
    component: LoginComponent,
    title: 'Login page',
  },
  {
    path: 'register',
    component: RegisterComponent,
    title: 'Register page',
  },
  {
    path: 'dashboard',
    component: RegisterComponent,
    title: 'Register page',
    children: [
      {
        path: 'profile',
        component: RegisterComponent,
        title: 'Register page',
      },
      {
        path: 'settings',
        component: RegisterComponent,
        title: 'Register page',
      },
    ],
  },
];
