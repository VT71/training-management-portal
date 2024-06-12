import { Component } from '@angular/core';
import { EmployeesTableComponent } from '../employees-table/employees-table.component';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { EmployeeFormDialogComponent } from './employee-form-dialog/employee-form-dialog.component';

@Component({
  selector: 'app-employees',
  standalone: true,
  imports: [EmployeesTableComponent, MatButtonModule],
  templateUrl: './employees.component.html',
  styleUrl: './employees.component.css',
})
export class EmployeesComponent {
  constructor(public dialog: MatDialog) {}

  openDialog() {
    const dialogRef = this.dialog.open(EmployeeFormDialogComponent);

    dialogRef.afterClosed().subscribe((result) => {
      console.log(`Dialog result: ${result}`);
    });
  }
}
