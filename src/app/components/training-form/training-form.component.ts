import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
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
import { BehaviorSubject, Observable, Subscription } from 'rxjs';
import { TrainingInterface } from '../../interfaces/training.interface';
import { EmployeeDepartmentAutoselectorComponent } from '../employee-department-autoselector/employee-department-autoselector.component';
import { NgxMaterialTimepickerModule } from 'ngx-material-timepicker';
import { MatTooltipModule } from '@angular/material/tooltip';
import {
  MatSnackBar,
  MatSnackBarHorizontalPosition,
  MatSnackBarRef,
  MatSnackBarVerticalPosition,
} from '@angular/material/snack-bar';
import { MatDialogRef } from '@angular/material/dialog';
import { TrainingComplete } from '../../interfaces/training-complete';

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

  public trainerErrorMsg = '';
  public trainer: number[] = [];

  public showAdditionalFields = false;
  public isWorkshop = false;

  public trainingForm = new FormGroup({
    trainingId: new FormControl(null),
    title: new FormControl('', [
      Validators.required,
      Validators.maxLength(255),
    ]),
    description: new FormControl('', Validators.required),
    individual: new FormControl(null, Validators.required),
    adress: new FormControl(''),
    deadline: new FormControl<string>('', Validators.required),
    trainer: new FormControl(''),
    time: new FormControl('', Validators.required),
    selectionType: new FormControl('', Validators.required),
    // title1: new FormControl(''),
    // description1: new FormControl(''),

  });

  horizontalPosition: MatSnackBarHorizontalPosition = 'start';
  verticalPosition: MatSnackBarVerticalPosition = 'bottom';

  constructor(
    private trainingApiService: TrainingsService,
    private _snackBar: MatSnackBar,
    private dialogRef: MatDialogRef<TrainingFormComponent>
  ) {}

  onIndividualChange() {
    this.showAdditionalFields =
      this.trainingForm.controls.individual.value === 1;
    this.isWorkshop = this.trainingForm.controls.individual.value === 0;
  }

  openSnackBar(message: string, action: string): MatSnackBarRef<any> {
    return this._snackBar.open(message, action, {
      duration: 1000,
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
    if (selectedValue.find((value: string) => value === 'departments')) {
      this.departmentsSelected = true;
    }
    if (selectedValue.find((value: string) => value === 'employees')) {
      this.employeesSelected = true;
    }
  }

  onSubmitTrainings() {
    const rawForm = this.trainingForm.getRawValue();
    console.log('Raw form values:', rawForm);
    if (this.checkAutocompletes()) {
      if (this.trainingForm.valid) {
        console.log('Form is valid.');

        const rawForm = this.trainingForm.getRawValue();
        console.log('Raw form values:', rawForm);

        const formattedDeadline = this.formatDateForAzure(
          this.trainingForm.value.deadline ?? '',
          this.trainingForm.value.time ?? ''
        );

        const trainingData: TrainingComplete = {
          trainingId: 1,
          title: this.trainingForm.value.title ?? '',
          description: this.trainingForm.value.description ?? '',
          individual: this.trainingForm.value.individual ?? 0,
          adress: this.trainingForm.value.adress ?? '',
          deadline: formattedDeadline,
          trainer: 'sadadasd',
          forDepartments: this.departmentsSelected ? 1 : 0,
          forEmployees: this.employeesSelected ? 1 : 0,
        //   title1: this.trainingForm.value.title1 ?? '',
        //   description1: this.trainingForm.value.description1 ?? '',
          departments: this.departments,
          employees: this.employees,
        };
        console.log('Training data:', trainingData);

        this.trainingApiService.createTraining(trainingData).subscribe({
          next: () => {
            console.log('Training created successfully');
            const snackBarRef: MatSnackBarRef<any> = this.openSnackBar(
              'Training created successfully',
              'Close'
            );
            this.dialogRef.close();

            snackBarRef.afterDismissed().subscribe(() => {
              window.location.reload();
            });
          },
          error: (error) => {
            console.error('Error creating training:', error);
            this.openSnackBar('Error creating training', 'Close');
          },
        });
      } else {
        // Adaugăm un mesaj de eroare pentru utilizator, dacă formularul este invalid
        this.openSnackBar(
          'Invalid form data. Please check the form again.',
          'Close'
        );
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

  public setTrainerError() {
    this.trainerErrorMsg = 'One trainer must be selected.';
  }

  public removeTrainerError() {
    this.trainerErrorMsg = '';
  }

  public onDepartmentsChange(departmentsList: number[]) {
    if (departmentsList?.length === 0) {
      this.setDepartmentsError();
      this.departments = []; // Resetează valorile la un array gol
    } else if (departmentsList?.length > 0) {
      this.removeDepartmentsError();
      this.departments = departmentsList; // Actualizează valorile cu selecțiile
    }
  }

  public onEmployeesChange(employeesList: number[]) {
    if (employeesList?.length === 0) {
      this.setEmployeesError();
      this.employees = []; // Resetează valorile la un array gol
    } else if (employeesList?.length > 0) {
      this.removeEmployeesError();
      this.employees = employeesList; // Actualizează valorile cu selecțiile
    }
  }

  public onTrainerChange(trainer: number[]) {
    if (trainer?.length !== 1) {
      this.setTrainerError();
      this.trainer = []; // Resetează valorile la un array gol
    } else if (trainer?.length === 1) {
      this.removeTrainerError();
      this.trainer = trainer; // Actualizează valorile cu selecțiile
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

    if (this.isWorkshop && this.trainer.length !== 0) {
      this.setTrainerError();
      valid = false;
    } else {
      this.removeTrainerError();
    }

    return valid;
  }

  ngOnDestroy() {
    this.subscriptions.forEach((sub) => sub.unsubscribe());
  }
}
