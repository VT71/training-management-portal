import { Component, AfterViewInit, ViewChild } from '@angular/core';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';

@Component({
  selector: 'app-departments-table',
  standalone: true,
  imports: [MatTableModule, MatPaginatorModule],
  templateUrl: './departments-table.component.html',
  styleUrl: './departments-table.component.css',
})
export class DepartmentsTableComponent implements AfterViewInit {
  displayedColumns: string[] = ['departmentId', 'departmentName'];
  dataSource = new MatTableDataSource<PeriodicElement>(ELEMENT_DATA);

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }
}

export interface PeriodicElement {
  departmentId: number;
  departmentName: string;
}

const ELEMENT_DATA: PeriodicElement[] = [
  {
    departmentId: 1,
    departmentName: 'Software Development',
  },
  {
    departmentId: 2,
    departmentName: 'Support',
  },
];
