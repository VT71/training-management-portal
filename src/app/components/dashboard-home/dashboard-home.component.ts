import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import {
  FormGroup,
  FormControl,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { GaugeChartComponent } from '../gauge-chart/gauge-chart.component';
import { MatTabGroup, MatTabsModule } from '@angular/material/tabs';
import { AdvancedPieComponent } from '../advanced-pie/advanced-pie.component';
import { GroupedVerticalBarChartComponent } from '../grouped-vertical-bar-chart/grouped-vertical-bar-chart.component';
import {
  DateAdapter,
  MAT_DATE_FORMATS,
  provideNativeDateAdapter,
} from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';
import { ReportsApiService } from '../../services/reports-api.service';
import { Observable, Subscription } from 'rxjs';
import { AsyncPipe } from '@angular/common';
import {
  MatDateFormats,
  MAT_NATIVE_DATE_FORMATS,
} from '@angular/material/core';
import { DepartmentProgress } from '../../interfaces/department-progress';

@Component({
  selector: 'app-dashboard-home',
  standalone: true,
  imports: [
    MatFormFieldModule,
    MatDatepickerModule,
    ReactiveFormsModule,
    GaugeChartComponent,
    MatTabsModule,
    AdvancedPieComponent,
    GroupedVerticalBarChartComponent,
    MatButtonModule,
    AsyncPipe,
  ],
  providers: [provideNativeDateAdapter()],
  templateUrl: './dashboard-home.component.html',
  styleUrl: './dashboard-home.component.css',
})
export class DashboardHomeComponent implements OnInit, OnDestroy {
  reportsAPiService = inject(ReportsApiService);

  allSubscriptions: Subscription[] = [];
  departmentsProgressSub!: Subscription;

  startDate: Date = new Date('2024-01-01T00:00:00.000');
  endDate: Date = new Date('2024-12-31T00:00:00.000');

  departmentsProgress: DepartmentProgress[] = [];
  overallPercentage: number = 0;
  totalTrainings: number = 0;
  totalCompletedTrainings: number = 0;

  readonly range = new FormGroup({
    start: new FormControl<Date | null>(this.startDate, [Validators.required]),
    end: new FormControl<Date | null>(this.endDate, [Validators.required]),
  });

  ngOnInit(): void {
    this.getFilteredReports(this.startDate, this.endDate);
  }

  public onSubmit() {
    if (this.range.valid) {
      const rawForm = this.range.getRawValue();
      if (rawForm.start && rawForm.end) {
        rawForm.start.setDate(rawForm.start.getDate() + 1);
        rawForm.end.setDate(rawForm.end.getDate() + 1);

        this.startDate = new Date(rawForm.start?.toISOString()?.slice(0, 10));
        this.endDate = new Date(rawForm.end?.toISOString()?.slice(0, 10));

        this.getFilteredReports(this.startDate, this.endDate);
      }
    }
  }

  public getFilteredReports(startDate: Date, endDate: Date) {
    this.departmentsProgress = [];
    this.totalTrainings = 0;
    this.totalCompletedTrainings = 0;
    this.overallPercentage = 0;

    this.departmentsProgressSub = this.reportsAPiService
      .getDepartmentsProgress(startDate?.toISOString(), endDate?.toISOString())
      .subscribe((res) => {
        this.departmentsProgress = res;

        for (const department of this.departmentsProgress) {
          this.totalTrainings += department.totalTrainingsCount;
          this.totalCompletedTrainings +=
            department.totalCompletedTrainingsCount;
        }

        if (this.totalTrainings > 0) {
          this.overallPercentage =
            (this.totalCompletedTrainings / this.totalTrainings) * 100;
        }
      });
    this.allSubscriptions.push(this.departmentsProgressSub);
  }

  public convertDate(date: Date | null): string {
    if (!date) {
      return '';
    }

    return date?.toISOString()?.slice(0, 10)?.split('-')?.reverse().join('/');
  }

  ngOnDestroy(): void {
    this.allSubscriptions.forEach((sub) => sub.unsubscribe());
  }
}
