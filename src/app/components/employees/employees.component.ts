import { Component } from '@angular/core';
import { EmployeesTableComponent } from '../employees-table/employees-table.component';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-employees',
  standalone: true,
  imports: [EmployeesTableComponent, MatButtonModule],
  templateUrl: './employees.component.html',
  styleUrl: './employees.component.css',
})
export class EmployeesComponent {}
