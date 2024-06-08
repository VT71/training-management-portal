import { Component, AfterViewInit, ViewChild } from '@angular/core';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';

@Component({
  selector: 'app-employees-table',
  standalone: true,
  imports: [MatTableModule, MatPaginatorModule],
  templateUrl: './employees-table.component.html',
  styleUrl: './employees-table.component.css',
})
export class EmployeesTableComponent implements AfterViewInit {
  displayedColumns: string[] = [
    'employeeId',
    'fullName',
    'department',
    'trainer',
  ];
  dataSource = new MatTableDataSource<PeriodicElement>(ELEMENT_DATA);

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }
}

export interface PeriodicElement {
  employeeId: number;
  fullName: string;
  department: string;
  trainer: boolean;
}

const ELEMENT_DATA: PeriodicElement[] = [
  {
    employeeId: 1,
    fullName: 'Victor Toma',
    department: 'Software Development',
    trainer: true,
  },
  {
    employeeId: 2,
    fullName: 'Victor Toma',
    department: 'Software Development',
    trainer: true,
  },
];
