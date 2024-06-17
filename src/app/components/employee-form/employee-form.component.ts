import { Component, Input, OnDestroy, inject } from '@angular/core';
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
import { UsersApiService } from '../../services/users-api.service';
import { EmployeesApiService } from '../../services/employees-api.service';
import { ModelSignal } from '@angular/core';

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
  private usersApiService = inject(UsersApiService);
  private employeeApiService = inject(EmployeesApiService);

  @Input() type!: string;
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
    this.departmentsErrorMsg = 'One department must be selected';
  }

  private removeDepartmentsError() {
    this.departmentsErrorMsg = '';
  }

  public onSubmit() {
    if (this.department >= 0) {
      if (this.form.valid) {
        const rawForm = this.form.getRawValue();

        const createUserSubscr = this.employeeApiService
          .createEmployee(
            rawForm?.fullName,
            rawForm?.email,
            rawForm?.trainer,
            this.department
          )
          .subscribe((res) => {
            this.closeDialog();
            window.location.reload();
          });

        this.subscriptions.push(createUserSubscr);
      }
    } else {
      this.setDepartmentsError();
    }
  }

  public onDepartmentsChange(departmentsList: number[]) {
    if (departmentsList?.length > 1 || departmentsList?.length === 0) {
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
