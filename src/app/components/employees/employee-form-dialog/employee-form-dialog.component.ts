import { Component, Inject, inject, model } from '@angular/core';
import {
  MatDialog,
  MatDialogModule,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { EmployeeFormComponent } from '../../employee-form/employee-form.component';
import { EmployeeComplete } from '../../../interfaces/employee-complete';

export interface DialogData {
  type: string;
  employee: EmployeeComplete;
}

@Component({
  selector: 'app-employee-form-dialog',
  standalone: true,
  imports: [MatButtonModule, MatDialogModule, EmployeeFormComponent],
  templateUrl: './employee-form-dialog.component.html',
  styleUrl: './employee-form-dialog.component.css',
})
export class EmployeeFormDialogComponent {
  constructor(@Inject(MAT_DIALOG_DATA) public data: DialogData) {}

  readonly type = this.data?.type;
  readonly employee = this.data?.employee;
}
