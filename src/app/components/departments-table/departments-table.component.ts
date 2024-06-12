import { Component, AfterViewInit, ViewChild, inject, OnInit } from '@angular/core';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { DepartmentsApiService } from '../../services/departments-api.service';
import { Observable, Subscription } from 'rxjs';
import { Department } from '../../interfaces/department';
import { AsyncPipe, NgIf } from '@angular/common';

@Component({
  selector: 'app-departments-table',
  standalone: true,
  imports: [MatTableModule, MatPaginatorModule, AsyncPipe, NgIf],
  templateUrl: './departments-table.component.html',
  styleUrl: './departments-table.component.css',
})
export class DepartmentsTableComponent implements AfterViewInit, OnInit {
  private departmentsData: Department[] = [];
  private subscriptions: Subscription[] = [];

  displayedColumns: string[] = ['departmentId', 'departmentName'];
  dataSource = new MatTableDataSource<Department>(this.departmentsData);
  private departmentApiService = inject(DepartmentsApiService);

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  ngOnInit() {
    const getDepartmentsSubscriptions = this.departmentApiService
      .getDepartments()
      .subscribe((res: Department[]) => {
        this.departmentsData = res;
        this.dataSource = new MatTableDataSource<Department>(
          this.departmentsData
        );
      });
    this.subscriptions.push(getDepartmentsSubscriptions);
  }

  ngOnDestroy() {
    this.subscriptions.forEach((subscription) => {
      subscription.unsubscribe();
    });
  }
}
