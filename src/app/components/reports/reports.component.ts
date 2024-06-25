import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import {
  FormGroup,
  FormControl,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { provideNativeDateAdapter } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { NgxChartsModule, ScaleType } from '@swimlane/ngx-charts';
import { PieGridComponent } from '../pie-grid/pie-grid.component';
import { AdvancedPieComponent } from '../advanced-pie/advanced-pie.component';

export const single = [
  {
    name: 'Overall',
    value: 8940000,
  },
  {
    name: 'By Departments',
    value: 5000000,
  },
  {
    name: 'By Employees',
    value: 7200000,
  },
];

@Component({
  selector: 'app-reports',
  standalone: true,
  imports: [
    MatFormFieldModule,
    MatDatepickerModule,
    MatInputModule,
    MatFormFieldModule,
    MatButtonModule,
    ReactiveFormsModule,
    NgxChartsModule,
    CommonModule,
    PieGridComponent,
    AdvancedPieComponent,
  ],
  providers: [provideNativeDateAdapter()],
  templateUrl: './reports.component.html',
  styleUrl: './reports.component.css',
})
export class ReportsComponent {
  readonly range = new FormGroup({
    start: new FormControl<Date | null>(null),
    end: new FormControl<Date | null>(null),
  });
}
