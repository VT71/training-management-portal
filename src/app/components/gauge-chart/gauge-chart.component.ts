import { Component, Input } from '@angular/core';
import { NgxChartsModule, ScaleType } from '@swimlane/ngx-charts';
import { LegendPosition } from '@swimlane/ngx-charts';

@Component({
  selector: 'app-gauge-chart',
  standalone: true,
  imports: [NgxChartsModule],
  templateUrl: './gauge-chart.component.html',
  styleUrl: './gauge-chart.component.css',
})
export class GaugeChartComponent {
  @Input()
  get data(): { name: string; value: number }[] {
    return this._data;
  }
  set data(value: { name: string; value: number }[]) {
    this._data = value;
  }
  public _data: { name: string; value: number }[] = [];
  @Input() title!: string;

  view: [number, number] = [400, 300];

  // options
  legend: boolean = true;
  legendPosition = LegendPosition.Below;

  colorScheme = {
    name: 'cool',
    selectable: true,
    group: ScaleType.Ordinal,
    domain: [
      '#a8385d',
      '#7aa3e5',
      '#a27ea8',
      '#aae3f5',
      '#adcded',
      '#a95963',
      '#8796c0',
      '#7ed3ed',
      '#50abcc',
      '#ad6886',
    ],
  };

  constructor() {
    Object.assign(this, { single: this._data });
  }

  onSelect(data: any): void {
  }

  onActivate(data: any): void {
  }

  onDeactivate(data: any): void {
  }
}
