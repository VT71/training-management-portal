import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { TrainingsComponent } from './trainings/trainings.component';
import { HomeComponent } from './home/home.component';

export const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  {
    path: '',
    component: HomeComponent,
    title: 'Home page',
    children: [
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
    ],
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
      },
    ],
  },
];
