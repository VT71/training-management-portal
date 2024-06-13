import { Component, OnDestroy, inject } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { EmployeeDepartmentAutoselectorComponent } from '../employee-department-autoselector/employee-department-autoselector.component';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Subscription } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { EmployeeFormDialogComponent } from '../employees/employee-form-dialog/employee-form-dialog.component';

@Component({
  selector: 'app-employee-form',
  standalone: true,
  imports: [
    MatFormFieldModule,
    MatSelectModule,
    MatButtonModule,
    MatInputModule,
    EmployeeDepartmentAutoselectorComponent,
    ReactiveFormsModule,
  ],
  templateUrl: './employee-form.component.html',
  styleUrl: './employee-form.component.css',
})
export class EmployeeFormComponent implements OnDestroy {
  public fb = inject(FormBuilder);
  private authService = inject(AuthService);

  public departmentsError = false;
  public departmentsErrorMsg = '';
  private department!: number;
  private subscriptions: Subscription[] = [];

  constructor(public dialog: MatDialog) {}

  private closeDialog() {
    const dialogRef = this.dialog.closeAll();
  }

  form = this.fb.nonNullable.group({
    fullName: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    trainer: [-1, [Validators.required, Validators.min(0), Validators.max(1)]],
  });

  private setDepartmentsError() {
    this.departmentsError = true;
    this.departmentsErrorMsg = 'One department must be selected';
  }

  private removeDepartmentsError() {
    this.departmentsError = false;
    this.departmentsErrorMsg = '';
  }

  public onSubmit() {
    if (this.department >= 0) {
      if (this.form.valid) {
        const rawForm = this.form.getRawValue();
        console.log({ department: this.department, ...rawForm });
        const createUserSubscr = this.authService
          .createNewUser(rawForm?.email)
          .subscribe((res) => {
            alert('User account created');
            this.closeDialog();
          });

        this.subscriptions.push(createUserSubscr);
      }
    } else {
      this.setDepartmentsError();
    }
  }

  public onDepartmentsChange(departmentsList: number[]) {
    if (departmentsList?.length > 1) {
      this.setDepartmentsError();
      this.department = -1;
    } else if (departmentsList?.length === 1) {
      this.department = departmentsList[0];
      this.removeDepartmentsError();
    }
  }

  ngOnDestroy() {
    this.subscriptions.forEach((subscription) => {
      subscription.unsubscribe();
    });
  }
}
