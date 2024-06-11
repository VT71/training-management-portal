import { Component, AfterViewInit, ViewChild, inject } from '@angular/core';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { EmployeeComplete } from '../../interfaces/employee-complete';
import { Subscription } from 'rxjs';
import { EmployeesApiService } from '../../services/employees-api.service';

@Component({
  selector: 'app-employees-table',
  standalone: true,
  imports: [MatTableModule, MatPaginatorModule],
  templateUrl: './employees-table.component.html',
  styleUrl: './employees-table.component.css',
})
export class EmployeesTableComponent implements AfterViewInit {
  private employeesCompleteData: EmployeeComplete[] = [];
  private subscriptions: Subscription[] = [];

  displayedColumns: string[] = [
    'employeeId',
    'userId',
    'fullName',
    'departmentName',
    'trainer',
  ];
  dataSource = new MatTableDataSource<EmployeeComplete>(
    this.employeesCompleteData
  );
  employeesApiService = inject(EmployeesApiService);

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  ngOnInit() {
    const getEmployeesCompleteSubscription = this.employeesApiService
      .getEmployeesComplete()
      .subscribe((res: EmployeeComplete[]) => {
        this.employeesCompleteData = res;
        this.dataSource = new MatTableDataSource<EmployeeComplete>(
          this.employeesCompleteData
        );
      });
    this.subscriptions.push(getEmployeesCompleteSubscription);
  }

  ngOnDestroy() {
    this.subscriptions.forEach((subscription) => {
      subscription.unsubscribe();
    });
  }
}
