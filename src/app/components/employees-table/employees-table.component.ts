import {
  Component,
  AfterViewInit,
  ViewChild,
  inject,
  OnInit,
  OnDestroy,
} from '@angular/core';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { EmployeeComplete } from '../../interfaces/employee-complete';
import { Subscription } from 'rxjs';
import { EmployeesApiService } from '../../services/employees-api.service';
import { MatButton, MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatDialog } from '@angular/material/dialog';
import { EmployeeFormDialogComponent } from '../employees/employee-form-dialog/employee-form-dialog.component';

@Component({
  selector: 'app-employees-table',
  standalone: true,
  imports: [
    MatTableModule,
    MatPaginatorModule,
    MatIconModule,
    MatButtonModule,
    MatMenuModule,
  ],
  templateUrl: './employees-table.component.html',
  styleUrl: './employees-table.component.css',
})
export class EmployeesTableComponent
  implements AfterViewInit, OnInit, OnDestroy
{
  private employeesCompleteData: EmployeeComplete[] = [];
  private subscriptions: Subscription[] = [];

  displayedColumns: string[] = [
    'employeeId',
    'userId',
    'email',
    'fullName',
    'departmentName',
    'trainer',
    'options',
  ];
  dataSource = new MatTableDataSource<EmployeeComplete>(
    this.employeesCompleteData
  );
  employeesApiService = inject(EmployeesApiService);

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(public dialog: MatDialog) {}

  openDialog() {
    const dialogRef = this.dialog.open(EmployeeFormDialogComponent, {
      data: { type: 'edit' },
    });

    dialogRef.afterClosed().subscribe((result) => {
      console.log(`Dialog result: ${result}`);
    });
  }

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
