import { Component } from '@angular/core';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { EmployeeFormComponent } from '../../employee-form/employee-form.component';

@Component({
  selector: 'app-employee-form-dialog',
  standalone: true,
  imports: [MatButtonModule, MatDialogModule, EmployeeFormComponent],
  templateUrl: './employee-form-dialog.component.html',
  styleUrl: './employee-form-dialog.component.css',
})
export class EmployeeFormDialogComponent {}
