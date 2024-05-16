import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { HomeComponent } from './home/home.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { TrainingsCalendarComponent } from './trainings-calendar/trainings-calendar.component';
import { MissedTrainingsComponent } from './missed-trainings/missed-trainings.component';
import { UpcomingTrainingsComponent } from './upcoming-trainings/upcoming-trainings.component';

const appName = 'Training Management Portal';

export const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  {
    path: '',
    component: HomeComponent,
    title: `Home | ${appName}`,
    children: [
      {
        path: 'login',
        component: LoginComponent,
        title: `Login | ${appName}`,
      },
      {
        path: 'register',
        component: RegisterComponent,
        title: `Register | ${appName}`,
      },
      {
        path: 'forgot-password',
        component: ForgotPasswordComponent,
        title: `Forgot Password | ${appName}`,
      },
    ],
  },
  {
    path: 'dashboard',
    component: DashboardComponent,
    title: `Dashboard | ${appName}`,
    children: [
      {
        path: 'trainings',
        component: TrainingsCalendarComponent,
        title: `Trainings | ${appName}`,
        children: [
          {
            path: 'missed',
            component: MissedTrainingsComponent,
            title: `Missed Trainings | ${appName}`,
          },
          {
            path: 'upcoming',
            component: UpcomingTrainingsComponent,
            title: `Upcoming Trainings | ${appName}`,
          },
        ],
      },
    ],
  },
];
