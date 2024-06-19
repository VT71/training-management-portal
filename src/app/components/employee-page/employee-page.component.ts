import { Component } from '@angular/core';
import { MatTabsModule } from '@angular/material/tabs';

@Component({
  selector: 'app-employee-page',
  standalone: true,
  imports: [MatTabsModule],
  templateUrl: './employee-page.component.html',
  styleUrl: './employee-page.component.css',
})
export class EmployeePageComponent {}
