import {
  ChangeDetectionStrategy,
  Component,
  Input,
  NgModule,
  OnDestroy,
  OnInit,
} from '@angular/core';
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
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TrainingFormComponent implements OnDestroy {
  @Input() type!: string;
  public departmentsSelected = false;
  public employeesSelected = false;

  public departmentsErrorMsg = '';
  public departments: number[] = [];

  public employeesErrorMsg = '';
  public employees: number[] = [];

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
      online: ['', Validators.required],
      deadline: ['', Validators.required],
      time: ['', Validators.required],
      selectionType: ['', Validators.required],
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
  public training$!: Observable<TrainingInterface>;

  onToggleChange(event: any) {
    const selectedValue = event.value;
    this.trainingForm.get('selectionType')?.setValue(selectedValue);
    console.log(selectedValue);
    this.employeesSelected = false;
    this.departmentsSelected = false;
    if (selectedValue.find((value: string)=> value==='departments')) {
      this.departmentsSelected = true;
    } 
    if (selectedValue.find((value: string)=> value==='employees')) {
      this.employeesSelected = true;
    }
  }

  // onSubmitTrainings() {
  //   if (this.checkAutocompletes()) {
  //     if (this.departmentsSelected) {
  //       if (this.departments?.length === 0) {
  //         this.setDepartmentsError();
  //       }
  //     }

  //     if (this.trainingForm.valid) {
  //       console.log('valid');
  //       const rawForm = this.trainingForm.getRawValue();
  //       console.log(rawForm);

  //       const formattedDeadline = this.formatDateForAzure(
  //         rawForm.deadline,
  //         rawForm.time
  //       );

  //       const {  title, description, online, deadline } = this.trainingForm.value;

  //       const trainingData: TrainingInterface = {
  //         title: 'asda',
  //         description: 'asdkja',
  //         online: 1,
  //         deadline: formattedDeadline,
  //       };

  //       this.trainingApiService

  //         .createTraining(trainingData as TrainingInterface)
  //         .subscribe({
  //           next: () => {
  //             console.log('Training created successfully');
  //             this.openSnackBar('Training created successfully', 'Close');
  //             this.dialogRef.close();
  //           },
  //           error: (error) => {
  //             console.error('Error creating training:', error);
  //             this.openSnackBar('Error creating training', 'Close');
  //           },
  //         });

  //     } else {
  //       console.log('invalid');
  //     }
  //   }
  // }

  onSubmitTrainings() {
    const rawForm = this.trainingForm.getRawValue();
      console.log('Raw form values:', rawForm);
    if(this.checkAutocompletes()){
    if ( this.trainingForm.valid) {
      console.log('Form is valid.');

      const rawForm = this.trainingForm.getRawValue();
      console.log('Raw form values:', rawForm);

      const formattedDeadline = this.formatDateForAzure(
        rawForm.deadline,
        rawForm.time
      );
      console.log('Formatted deadline:', formattedDeadline);

      const trainingData: TrainingInterface = {
        title: rawForm.title,
        description: rawForm.description,
        online: rawForm.online,
        deadline: formattedDeadline,
        forDepartments: this.departmentsSelected,
        forEmployees: this.employeesSelected,
        departments: this.departments,
        employees: this.employees,
      };
      console.log('Training data:', trainingData);

      this.trainingApiService.createTraining(trainingData).subscribe({
        next: () => {
          console.log('Training created successfully'); 
          this.openSnackBar('Training created successfully', 'Close');
          this.dialogRef.close();
        },
        error: (error) => {
          console.error('Error creating training:', error);
          this.openSnackBar('Error creating training', 'Close');
        },
      });
    } else {
      console.log('Form is invalid.');
      console.log('Autocompletes check:', this.checkAutocompletes());
      console.log('Form validity:', this.trainingForm.valid);
      console.log('Form errors:', this.trainingForm.errors);
      // Adaugăm un mesaj de eroare pentru utilizator, dacă formularul este invalid
      this.openSnackBar(
        'Invalid form data. Please check the form again.',
        'Close'
      );
    }}
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

  public setDepartmentsError() {
    this.departmentsErrorMsg = 'At least one department must be selected.';
  }

  public removeDepartmentsError() {
    this.departmentsErrorMsg = '';
  }

  public setEmployeesError() {
    this.employeesErrorMsg = 'At least one employee must be selected.';
  }

  public removeEmployeesError() {
    this.employeesErrorMsg = '';
  }

  public onDepartmentsChange(departmentsList: number[]) {
    if (departmentsList?.length === 0 && this.departmentsSelected) {
      this.setDepartmentsError();
      this.departments = []; // Resetează valorile la un array gol
    } else if (departmentsList?.length > 0 && this.departmentsSelected) {
      this.removeDepartmentsError();
      this.departments = departmentsList; // Actualizează valorile cu selecțiile
    }
  }
  
  public onEmployeesChange(employeesList: number[]) {
    if (employeesList?.length === 0 && this.employeesSelected) {
      this.setEmployeesError();
      this.employees = []; // Resetează valorile la un array gol
    } else if (employeesList?.length > 0 && this.employeesSelected) {
      this.removeEmployeesError();
      this.employees = employeesList; // Actualizează valorile cu selecțiile
    }
  }
  

  private checkAutocompletes(): boolean {
    let valid = true;
  
    if (this.departmentsSelected && this.departments.length === 0) {
      this.setDepartmentsError();
      valid = false;
    } else {
      this.removeDepartmentsError();
    }
  
    if (this.employeesSelected && this.employees.length === 0) {
      this.setEmployeesError();
      valid = false;
    } else {
      this.removeEmployeesError();
    }
  
    return valid;
  }

  

  ngOnDestroy() {
    this.subscriptions.forEach((sub) => sub.unsubscribe());
  }
}
