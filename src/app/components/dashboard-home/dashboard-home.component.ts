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
import { provideNativeDateAdapter } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';
import { ReportsApiService } from '../../services/reports-api.service';
import { Observable } from 'rxjs';
import { AsyncPipe } from '@angular/common';

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

  readonly range = new FormGroup({
    start: new FormControl<Date | null>(null, [Validators.required]),
    end: new FormControl<Date | null>(null, [Validators.required]),
  });

  ngOnInit(): void {
    this.completedTrainingsFromTotal$ =
      this.reportsAPiService.getPercentageOfCompletedTrainingsByRange(
        '2023-01-01T09:26:40.577',
        '2028-01-01T09:26:40.577'
      );
  }

  public onSubmit() {
    console.log('DATE: ' + new Date().toISOString());
  }
}
