import { Component } from '@angular/core';
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
  single!: any[];
  view: [number, number] = [900, 250];

  // options
  legend: boolean = false;
  legendPosition = LegendPosition.Below;

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

  onSelect(data: any): void {
    console.log('Item clicked', JSON.parse(JSON.stringify(data)));
  }

  onActivate(data: any): void {
    console.log('Activate', JSON.parse(JSON.stringify(data)));
  }

  onDeactivate(data: any): void {
    console.log('Deactivate', JSON.parse(JSON.stringify(data)));
  }
}
