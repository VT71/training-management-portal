import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { HomeComponent } from './components/home/home.component';
import { ForgotPasswordComponent } from './components/forgot-password/forgot-password.component';
import { TrainingsCalendarComponent } from './components/trainings-calendar/trainings-calendar.component';
import { VerifyEmailComponent } from './components/verify-email/verify-email.component';
import { authGuard } from './guards/auth.guard';
import { NotificationsComponent } from './components/notifications/notifications.component';
import { TrainingFormComponent } from './components/training-form/training-form.component';
import { AddTrainingComponent } from './components/add-training/add-training.component';
import { DashboardHomeComponent } from './components/dashboard-home/dashboard-home.component';
import { SettingsComponentComponent } from './components/settings-component/settings-component.component';
import { ReportsComponent } from './components/reports/reports.component';
import { TrainingPageComponent } from './components/training-page/training-page.component';
import { EmployeesComponent } from './components/employees/employees.component';
import { DepartmentsComponent } from './components/departments/departments.component';
import { EmployeePageComponent } from './components/employee-page/employee-page.component';
import { adminGuard } from './guards/admin.guard';
import { TrainingsListComponent } from './trainings-list/trainings-list.component';

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
    canActivate: [authGuard],
    children: [
      {
        path: '',
        component: DashboardHomeComponent,
        title: `Dashboard Home | ${appName}`,
        canActivate: [adminGuard],
      },
      {
        path: 'employee-dashboard',
        component: EmployeePageComponent,
        title: `Dashboard Home | ${appName}`,
      },
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
        path: 'trainings/:type',
        component: TrainingsListComponent,
        title: `Trainings | ${appName}`,
      },
      {
        path: 'notifications',
        component: NotificationsComponent,
        title: `Notifications | ${appName}`,
      },
      {
        path: 'reports',
        component: ReportsComponent,
        title: `Reports | ${appName}`,
      },
      {
        path: 'settings',
        component: SettingsComponentComponent,
        title: `Settings | ${appName}`,
      },
      {
        path: 'trainings/add-training',
        component: AddTrainingComponent,
        title: `Add Training | ${appName}`,
      },
      {
        path: 'training/:id',
        component: TrainingPageComponent,
        title: `Training | ${appName}`,
      },
      {
        path: 'employees',
        component: EmployeesComponent,
        title: `Employees Page | ${appName}`,
        canActivate: [adminGuard],
      },
      {
        path: 'employee/:id',
        component: EmployeePageComponent,
        title: `Employee Page | ${appName}`,
        canActivate: [adminGuard],
      },
      {
        path: 'departments',
        component: DepartmentsComponent,
        title: `Departments Page | ${appName}`,
        canActivate: [adminGuard],
      },
    ],
  },
  { path: '**', redirectTo: '/dashboard' },
];
