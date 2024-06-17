import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { provideNativeDateAdapter } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { ChipsAutocompleteComponent } from './chips-autocomplete/chips-autocomplete.component';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { CommonModule } from '@angular/common';
import { TrainingsService } from '../../services/trainings.service';

import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Observable, Subscription } from 'rxjs';
import { TrainingInterface } from '../../interfaces/training.interface';
import { EmployeeDepartmentAutoselectorComponent } from '../employee-department-autoselector/employee-department-autoselector.component';
import { NgxMaterialTimepickerModule } from 'ngx-material-timepicker';
import { BrowserModule } from '@angular/platform-browser';
import { MatTooltipModule } from '@angular/material/tooltip';
import {
  MatSnackBar,
  MatSnackBarHorizontalPosition,
  MatSnackBarVerticalPosition,
} from '@angular/material/snack-bar';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-training-form',
  standalone: true,
  imports: [
    NgxMaterialTimepickerModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatDatepickerModule,
    MatButtonModule,
    MatSelectModule,
    ChipsAutocompleteComponent,
    MatButtonToggleModule,
    CommonModule,
    ReactiveFormsModule,
    EmployeeDepartmentAutoselectorComponent,
    MatTooltipModule,
    MatTooltipModule,
  ],
  templateUrl: './training-form.component.html',
  styleUrl: './training-form.component.css',
  providers: [provideNativeDateAdapter()],
})
export class TrainingFormComponent implements OnDestroy {
  @Input() type!: string;
  public departmentsSelected = true;
  public employeesSelected = true;

  public departmentsErrorMsg = '';
  private departments: number[] = [];

  public employeesErrorMsg = '';
  private employees: number[] = [];

  ngOnInit() {
    console.log(this.type);
  }
  trainingForm: FormGroup = new FormGroup({});

  horizontalPosition: MatSnackBarHorizontalPosition = 'start';
  verticalPosition: MatSnackBarVerticalPosition = 'bottom';

  constructor(
    private fb: FormBuilder,
    private trainingApiService: TrainingsService,
    private _snackBar: MatSnackBar,
    private dialogRef: MatDialogRef<TrainingFormComponent>
  ) {
    this.trainingForm = this.fb.group({
      title: ['', [Validators.required, Validators.maxLength(255)]],
      description: ['', Validators.required],
      online: [1, Validators.required],
      deadline: ['formattedDeadline', Validators.required],
      time: ['', Validators.required],
    });
  }

  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, {
      duration: 2000,
      horizontalPosition: 'right',
      verticalPosition: 'top',
    });
  }
  private subscriptions: Subscription[] = [];
  public trainingId!: number;
  public training$!: Observable<TrainingInterface>;

  onSubmitTrainings() {
    if (this.checkAutocompletes()) {
      if (this.departmentsSelected) {
        if (this.departments?.length === 0) {
          this.setDepartmentsError();
        }
      }

      if (this.trainingForm.valid) {
        console.log('valid');
        const rawForm = this.trainingForm.getRawValue();
        console.log(rawForm);

        const formattedDeadline = this.formatDateForAzure(
          rawForm.deadline,
          rawForm.time
        );

        const { title, description, online } = this.trainingForm.value;

      this.trainingApiService
        .createTraining(trainingData as TrainingInterface)
        .subscribe({
          next: () => {
            console.log('Training created successfully');
            this.openSnackBar('Training created successfully', 'Close');
            this.dialogRef.close(); // Închide dialogul
          },
          error: (error) => {
            console.error('Error creating training:', error);
            this.openSnackBar('Error creating training', 'Close');
          },
        });
    } else {
      console.log('invalid');
        const trainingData = {
          title,
          description,
          online: 1,
          deadline: formattedDeadline,
          forEmployees: 1,
          forDepartments: 1,
        };

        this.trainingApiService
          .createTraining(trainingData as TrainingInterface)
          .subscribe({
            next: () => {
              console.log('Training created successfully');
            },
            error: (error) => {
              console.error('Error creating training:', error);
            },
          });
      } else {
        console.log('invalid');
      }
    }
  }

  public formatDateForAzure(dateString: string, timeString: string): string {
    let date = new Date(dateString);

    let year = date.getFullYear();
    let month = String(date.getMonth() + 1).padStart(2, '0');
    let day = String(date.getDate()).padStart(2, '0');

    let [hours, minutes] = timeString.split(':');
    let seconds = '00'; // Poți adăuga secunde dacă este necesar
    let milliseconds = '000';
    // Combinăm componentele într-un singur string
    return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}.${milliseconds}Z`;
  }

  private setDepartmentsError() {
    this.departmentsErrorMsg = 'At least one department must be selected.';
  }

  private removeDepartmentsError() {
    this.departmentsErrorMsg = '';
  }

  private setEmployeesError() {
    this.employeesErrorMsg = 'At least one employee must be selected.';
  }

  private removeEmployeesError() {
    this.employeesErrorMsg = '';
  }

  public onDepartmentsChange(departmentsList: number[]) {
    if (departmentsList?.length === 0 && this.departmentsSelected) {
      this.setDepartmentsError();
      this.departments = [];
    } else if (departmentsList?.length > 0 && this.departmentsSelected) {
      this.removeDepartmentsError();
      this.departments = departmentsList;
    }
  }

  public onEmployeesChange(employeesList: number[]) {
    console.log('Employees: ' + employeesList);
    if (employeesList?.length === 0 && this.employeesSelected) {
      this.setEmployeesError();
      this.employees = [];
    } else if (employeesList?.length > 0 && this.departmentsSelected) {
      this.removeEmployeesError();
      this.employees = employeesList;
    }
  }

  private checkAutocompletes(): boolean {
    let valid = false;
    if (this.departmentsSelected || this.employeesSelected) {
      if (this.departmentsSelected) {
        if (this.departments?.length > 1) {
          this.removeDepartmentsError();
          valid = true;
        } else {
          this.setDepartmentsError();
          valid = false;
        }
      }

      if (this.employeesSelected) {
        if (this.employees?.length > 1) {
          this.removeDepartmentsError();
          valid = true;
        } else {
          this.setDepartmentsError();
          valid = false;
        }
      }
    }
    return valid;
  }

  ngOnDestroy() {
    this.subscriptions.forEach((sub) => sub.unsubscribe());
  }
}
