import { Component } from '@angular/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormGroup, FormControl, ReactiveFormsModule } from '@angular/forms';
import { GaugeChartComponent } from '../gauge-chart/gauge-chart.component';
import { MatTabGroup, MatTabsModule } from '@angular/material/tabs';
import { AdvancedPieComponent } from '../advanced-pie/advanced-pie.component';
import { GroupedVerticalBarChartComponent } from '../grouped-vertical-bar-chart/grouped-vertical-bar-chart.component';
import { provideNativeDateAdapter } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';

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
    MatButtonModule
  ],
  providers: [provideNativeDateAdapter()],
  templateUrl: './dashboard-home.component.html',
  styleUrl: './dashboard-home.component.css',
})
export class DashboardHomeComponent {
  readonly range = new FormGroup({
    start: new FormControl<Date | null>(null),
    end: new FormControl<Date | null>(null),
  });
}
