import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { TrainingsComponent } from './trainings/trainings.component';

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
    component: DashboardComponent,
    title: 'Dashboard page',
    children: [
      {
        path: 'trainings',
        component: TrainingsComponent,
        title: 'Register page',
      }
    ],
  },
];
