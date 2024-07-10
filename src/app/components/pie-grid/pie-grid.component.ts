import { Component } from '@angular/core';
import { NgxChartsModule, ScaleType } from '@swimlane/ngx-charts';

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
  selector: 'app-pie-grid',
  standalone: true,
  imports: [NgxChartsModule],
  templateUrl: './pie-grid.component.html',
  styleUrl: './pie-grid.component.css',
})
export class PieGridComponent {
  single!: any[];
  view: [number, number] = [900, 250];

  // options
  showLegendPieGrid: boolean = true;
  showLabels: boolean = true;

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
    Object.assign(this, { single });
  }

  onSelectPieGrid(event: any) {
  }
}
