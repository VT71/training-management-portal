import { Component, Input } from '@angular/core';
import { NgxChartsModule, ScaleType } from '@swimlane/ngx-charts';

@Component({
  selector: 'app-advanced-pie',
  standalone: true,
  imports: [NgxChartsModule],
  templateUrl: './advanced-pie.component.html',
  styleUrl: './advanced-pie.component.css',
})
export class AdvancedPieComponent {
  @Input()
  get data(): { name: string; value: number }[] {
    return this._data;
  }
  set data(value: { name: string; value: number }[]) {
    this._data = value;
  }
  public _data: { name: string; value: number }[] = [];

  view: [number, number] = [900, 300];

  // options
  gradient: boolean = false;
  showLegend: boolean = true;
  showLabels: boolean = true;
  isDoughnut: boolean = false;

  colorScheme = {
    name: 'ocean',
    selectable: false,
    group: ScaleType.Ordinal,
    domain: [
      '#1D68FB',
      '#33C0FC',
      '#4AFFFE',
      '#AFFFFF',
      '#FFFC63',
      '#FDBD2D',
      '#FC8A25',
      '#FA4F1E',
      '#FA141B',
      '#BA38D1',
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
