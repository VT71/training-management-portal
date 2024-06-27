import { Component, OnInit, inject } from '@angular/core';
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
import { Observable } from 'rxjs';
import { AsyncPipe } from '@angular/common';
import {
  MatDateFormats,
  MAT_NATIVE_DATE_FORMATS,
} from '@angular/material/core';

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
export class DashboardHomeComponent implements OnInit {
  reportsAPiService = inject(ReportsApiService);

  completedTrainingsFromTotal$!: Observable<number>;

  startDate: Date = new Date('2024-01-01T00:00:00.000');
  endDate: Date = new Date('2024-12-31T00:00:00.000');

  readonly range = new FormGroup({
    start: new FormControl<Date | null>(this.startDate, [Validators.required]),
    end: new FormControl<Date | null>(this.endDate, [Validators.required]),
  });

  ngOnInit(): void {
    const rawForm = this.range.getRawValue();
    if (rawForm.start && rawForm.end) {
      this.completedTrainingsFromTotal$ =
        this.reportsAPiService.getPercentageOfCompletedTrainingsByRange(
          rawForm.start.toISOString(),
          rawForm.end.toISOString()
        );
    }
  }

  public onSubmit() {
    if (this.range.valid) {
      const rawForm = this.range.getRawValue();
      if (rawForm.start && rawForm.end) {
        rawForm.start.setDate(rawForm.start.getDate() + 1);
        rawForm.end.setDate(rawForm.end.getDate() + 1);

        this.startDate = new Date(rawForm.start?.toISOString()?.slice(0, 10));
        this.endDate = new Date(rawForm.end?.toISOString()?.slice(0, 10));
      }
    }
  }

  public convertDate(date: Date | null): string {
    if (!date) {
      return '';
    }

    return date?.toISOString()?.slice(0, 10)?.split('-')?.reverse().join('/');
  }
}
