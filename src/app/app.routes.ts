import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { HomeComponent } from './home/home.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { TrainingsCalendarComponent } from './trainings-calendar/trainings-calendar.component';
import { MissedTrainingsComponent } from './missed-trainings/missed-trainings.component';
import { UpcomingTrainingsComponent } from './upcoming-trainings/upcoming-trainings.component';
import { VerifyEmailComponent } from './verify-email/verify-email.component';
import { authGuard } from './auth.guard';
import { NotificationsComponent } from './notifications/notifications.component';

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
        path: 'verify-email',
        component: VerifyEmailComponent,
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
    // canActivate: [authGuard],
    children: [
      {
        path: 'trainings',
        redirectTo: 'trainings/calendar',
        pathMatch: 'full',
      },
      {
        path: 'trainings/calendar',
        component: TrainingsCalendarComponent,
        title: `Trainings | ${appName}`,
      },
      {
        path: 'trainings/missed',
        component: MissedTrainingsComponent,
        title: `Missed Trainings | ${appName}`,
      },
      {
        path: 'trainings/upcoming',
        component: UpcomingTrainingsComponent,
        title: `Upcoming Trainings | ${appName}`,
      },
      {
        path: 'notifications',
        component: NotificationsComponent,
        title: `Notifications | ${appName}`,
      },
    ],
  },
  { path: '**', redirectTo: '/login' },
];
