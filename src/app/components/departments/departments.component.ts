import { Component } from '@angular/core';
import { DepartmentsTableComponent } from '../departments-table/departments-table.component';

@Component({
  selector: 'app-departments',
  standalone: true,
  imports: [DepartmentsTableComponent],
  templateUrl: './departments.component.html',
  styleUrl: './departments.component.css',
})
export class DepartmentsComponent {}
