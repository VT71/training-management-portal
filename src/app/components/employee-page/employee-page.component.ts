import { AsyncPipe } from '@angular/common';
import { Component, Input, OnDestroy, OnInit, inject } from '@angular/core';
import { MatTabsModule } from '@angular/material/tabs';
import { Observable, Subscription, share } from 'rxjs';
import { EmployeeComplete } from '../../interfaces/employee-complete';
import { EmployeesApiService } from '../../services/employees-api.service';
import { TrainingsService } from '../../services/trainings.service';
import { TrainingInterface } from '../../interfaces/training.interface';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-employee-page',
  standalone: true,
  imports: [MatTabsModule, AsyncPipe, RouterLink],
  templateUrl: './employee-page.component.html',
  styleUrl: './employee-page.component.css',
})
export class EmployeePageComponent implements OnInit, OnDestroy {
  @Input() id!: number;
  private subscriptions: Subscription[] = [];

  private trainingsApiService = inject(TrainingsService);
  private employeeApiService = inject(EmployeesApiService);
  private authService = inject(AuthService);

  public missedTrainings$!: Observable<TrainingInterface[]>;
  public completedTrainings$!: Observable<TrainingInterface[]>;
  public upcomingTrainings$!: Observable<TrainingInterface[]>;
  public inProgressTrainings$!: Observable<TrainingInterface[]>;
  public employeeData$!: Observable<EmployeeComplete>;

  public adminVersion = false;

  ngOnInit() {
    if (this.id) {
      this.employeeData$ = this.employeeApiService.getEmployeeComplete(this.id);
      this.missedTrainings$ = this.trainingsApiService
        .getMissedTrainingsByEmployee(this.id)
        .pipe(share());
      this.completedTrainings$ = this.trainingsApiService
        .getCompletedTrainingsByEmployee(this.id)
        .pipe(share());
      this.upcomingTrainings$ = this.trainingsApiService
        .getUpcomingTrainingsByEmployee(this.id)
        .pipe(share());
      this.inProgressTrainings$ = this.trainingsApiService
        .getInProgressTrainingsByEmployee(this.id)
        .pipe(share());
    } else {
      this.employeeData$ = this.employeeApiService.getEmployeeComplete(this.id);
    }

    const roleSubscription = this.authService.rolesource.subscribe((role) => {
      if (role === 'admin') {
        this.adminVersion = true;
      } else {
        this.adminVersion = false;
        const sessionAuthUser = sessionStorage.getItem('authUser');
        if (sessionAuthUser) {
          const objSessionAuthUser = JSON.parse(sessionAuthUser);
          if (objSessionAuthUser?.uid) {
            this.employeeData$ = this.employeeApiService.getEmployeeComplete(
              0,
              objSessionAuthUser?.uid
            );
          }
        }
      }
    });
    this.subscriptions?.push(roleSubscription);
  }

  public convertDate(date: string): string {
    if (date) {
      return (
        date.slice(11, 16) +
        ' ' +
        date.slice(0, 10).split('-').reverse().join('-').replaceAll('-', '/')
      );
    } else {
      return '';
    }
  }

  ngOnDestroy(): void {
    this.subscriptions?.forEach((subscription) => subscription.unsubscribe());
  }
}
