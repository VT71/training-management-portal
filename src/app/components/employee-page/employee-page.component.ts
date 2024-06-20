import { AsyncPipe } from '@angular/common';
import { Component, Input, OnInit, inject } from '@angular/core';
import { MatTabsModule } from '@angular/material/tabs';
import { Observable, share } from 'rxjs';
import { EmployeeComplete } from '../../interfaces/employee-complete';
import { EmployeesApiService } from '../../services/employees-api.service';
import { TrainingsService } from '../../services/trainings.service';
import { TrainingInterface } from '../../interfaces/training.interface';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-employee-page',
  standalone: true,
  imports: [MatTabsModule, AsyncPipe, RouterLink],
  templateUrl: './employee-page.component.html',
  styleUrl: './employee-page.component.css',
})
export class EmployeePageComponent implements OnInit {
  @Input() id!: number;

  private trainingsApiService = inject(TrainingsService);
  private employeeApiService = inject(EmployeesApiService);

  public missedTrainings$!: Observable<TrainingInterface[]>;
  public completedTrainings$!: Observable<TrainingInterface[]>;
  public employeeData$!: Observable<EmployeeComplete>;

  ngOnInit() {
    if (this.id) {
      this.employeeData$ = this.employeeApiService.getEmployeeComplete(this.id);
      this.missedTrainings$ = this.trainingsApiService
        .getMissedTrainingsByEmployee(this.id)
        .pipe(share());
      this.completedTrainings$ = this.trainingsApiService
        .getCompletedTrainingsByEmployee(this.id)
        .pipe(share());
    }
  }

  public convertDate(date: string): string {
    if (date) {
      return date
        .slice(0, 10)
        .split('-')
        .reverse()
        .join('-')
        .replaceAll('-', '/');
    } else {
      return '';
    }
  }
}
