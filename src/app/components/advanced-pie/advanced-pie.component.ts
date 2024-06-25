import { Component } from '@angular/core';
import { NgxChartsModule, ScaleType } from '@swimlane/ngx-charts';

export const single = [
  {
    name: 'Software Development',
    value: 89,
  },
  {
    name: 'Customer Support',
    value: 120,
  },
];

@Component({
  selector: 'app-advanced-pie',
  standalone: true,
  imports: [NgxChartsModule],
  templateUrl: './advanced-pie.component.html',
  styleUrl: './advanced-pie.component.css',
})
export class AdvancedPieComponent {
  single!: any[];
  view: [number, number] = [900, 300];

  // options
  gradient: boolean = false;
  showLegend: boolean = true;
  showLabels: boolean = true;
  isDoughnut: boolean = false;

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
