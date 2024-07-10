import { Component, Input } from '@angular/core';
import { NgxChartsModule, ScaleType } from '@swimlane/ngx-charts';

export const multi = [
  {
    name: 'Software Development',
    series: [
      {
        name: 'Missed',
        value: 7300000,
      },
      {
        name: 'In Progress',
        value: 8940000,
      },
      {
        name: 'Completed',
        value: 8940000,
      },
      {
        name: 'Upcoming',
        value: 8940000,
      },
    ],
  },

  {
    name: 'Customer Support',
    series: [
      {
        name: 'Missed',
        value: 5300000,
      },
      {
        name: 'In Progress',
        value: 3940000,
      },
      {
        name: 'Completed',
        value: 10940000,
      },
      {
        name: 'Upcoming',
        value: 2940000,
      },
    ],
  },
];

@Component({
  selector: 'app-grouped-vertical-bar-chart',
  standalone: true,
  imports: [NgxChartsModule],
  templateUrl: './grouped-vertical-bar-chart.component.html',
  styleUrl: './grouped-vertical-bar-chart.component.css',
})
export class GroupedVerticalBarChartComponent {
  @Input()
  get data(): { name: string; series: { name: string; value: number }[] }[] {
    return this._data;
  }
  set data(
    value: { name: string; series: { name: string; value: number }[] }[]
  ) {
    this._data = value;
  }
  public _data: { name: string; series: { name: string; value: number }[] }[] =
    [];
  view: any[] = [700, 400];

  // options
  showXAxis: boolean = true;
  showYAxis: boolean = true;
  gradient: boolean = false;
  showLegend: boolean = true;
  showXAxisLabel: boolean = true;
  xAxisLabel: string = 'Department';
  showYAxisLabel: boolean = true;
  yAxisLabel: string = 'Trainings';
  legendTitle: string = 'Training Types';

  colorScheme = {
    name: 'natural',
    selectable: true,
    group: ScaleType.Ordinal,
    domain: [
      '#bf9d76',
      '#e99450',
      '#d89f59',
      '#f2dfa7',
      '#a5d7c6',
      '#7794b1',
      '#afafaf',
      '#707160',
      '#ba9383',
      '#d9d5c3',
    ],
  };

  constructor() {
    Object.assign(this, { multi: this._data });
  }

  onSelect(data: any): void {
  }

  onActivate(data: any): void {
  }

  onDeactivate(data: any): void {
  }
}
