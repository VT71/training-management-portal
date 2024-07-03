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
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Observable, Subscription } from 'rxjs';
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
import { Department } from '../../interfaces/department';
import { Employee } from '../../interfaces/employee';
import { Sections } from '../../interfaces/sections';

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
export class TrainingFormComponent implements OnDestroy, OnInit {
  @Input() type!: string;
  @Input() trainingId!: number;
  @Input() deadline!: string;
  public departmentsSelected = false;
  public employeesSelected = false;

  public departmentsErrorMsg = '';
  public departments: number[] = [];

  public employeesErrorMsg = '';
  public employees: number[] = [];

  public sections: Sections[] = [];

  public trainerErrorMsg = '';
  public trainer: number[] = [];

  public showAdditionalFields = false;
  public isWorkshop = false;

  public trainingForm = new FormGroup({
    trainingId: new FormControl(null as number | null),
    title: new FormControl('', [
      Validators.required,
      Validators.maxLength(255),
    ]),
    description: new FormControl('', Validators.required),
    individual: new FormControl(1, Validators.required),
    adress: new FormControl(''),
    deadline: new FormControl<string>('', Validators.required),
    time: new FormControl('', Validators.required),
    selectionType: new FormControl<string[]>([], Validators.required),
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

  ngOnInit() {
    if (this.type === 'edit') {
      this.trainingApiService
        .getTrainingById(this.trainingId)
        .subscribe((training) => {
          const date = new Date(training.deadline);
          const datePart = date.toISOString().split('T')[0]; // Obține partea de dată
          const timePart = date.toTimeString().split(' ')[0].slice(0, 5);
          this.trainingForm.setValue({
            trainingId: training.trainingId,
            title: training.title,
            description: training.description,
            individual: training.individual,
            adress: training.adress,
            deadline: datePart,
            time: timePart,
            selectionType:
              training.forDepartments === 1 && training.forEmployees === 1
                ? ['departments', 'employees']
                : training.forDepartments === 1
                ? ['departments']
                : training.forEmployees === 1
                ? ['employees']
                : [],
          });
          this.departments = training.departments.map(
            (department) => department.departmentId
          );
          this.employees = training.employees.map(
            (employee) => employee.employeeId
          );
          this.departmentsSelected = training.forDepartments === 1;
          this.employeesSelected = training.forEmployees === 1;
        });
    } else {
      this.trainingForm.controls.deadline.setValue(this.deadline);
    }
  }

  onIndividualChange(event: any) {
    this.isWorkshop = event.value === 0;
    if (event.value === 1) {
      if (this.sections.length === 0) {
        this.addSection();
      }
    }
  }

  openSnackBar(message: string, action: string): MatSnackBarRef<any> {
    return this._snackBar.open(message, action, {
      duration: 1000,
      horizontalPosition: 'right',
      verticalPosition: 'top',
    });
  }

  private subscriptions: Subscription[] = [];
  public training$!: Observable<TrainingComplete>;

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
    if (this.checkAutocompletes()) {
      if (this.trainingForm.valid) {
        console.log('Form is valid.');

        const rawForm = this.trainingForm.getRawValue();
        console.log('Raw form values:', rawForm);

        const formattedDeadline = this.formatDateForAzure(
          this.trainingForm.value.deadline ?? '',
          this.trainingForm.value.time ?? ''
        );
        const departmentsData = this.departments.map((department) => {
          return { departmentId: department } as Department;
        });
        const employeesData = this.employees.map((employee) => {
          return {
            employeeId: employee,
            trainer: 0,
            userId: '',
            departmentId: 0,
          } as Employee;
        });

        this.sections = this.sections.map((section, index) => {
          const sectionTitleControlName = `sectionTitle${index}`;
          const sectionDescrControlName = `sectionDescription${index}`;
          return {
            sectionId: 0,
            title: (this.trainingForm.value as any)[sectionTitleControlName] ?? '',
            description: (this.trainingForm.value as any)[sectionDescrControlName] ?? '',
          };
        })

        const trainingData: TrainingInterface = {
          trainingId: this.trainingForm.value.trainingId ?? 0,
          title: this.trainingForm.value.title ?? '',
          description: this.trainingForm.value.description ?? '',
          individual: this.trainingForm.value.individual ?? 0,
          adress: this.trainingForm.value.adress ?? '',
          deadline: formattedDeadline,
          trainer: this.trainer[0],
          // status: '',
          forDepartments: this.departmentsSelected ? 1 : 0,
          forEmployees: this.employeesSelected ? 1 : 0,
        };
        console.log(
          'Training data:',
          trainingData,
          departmentsData,
          employeesData
        );

        if (this.type === 'edit') {
          this.trainingApiService
            .updateTrainingById(trainingData, departmentsData, employeesData)
            .subscribe({
              next: () => {
                console.log('Training updated successfully');
                const snackBarRef: MatSnackBarRef<any> = this.openSnackBar(
                  'Training updated successfully',
                  'Close'
                );
                this.dialogRef.close();

                snackBarRef.afterDismissed().subscribe(() => {
                  window.location.reload();
                });
              },
              error: (error) => {
                console.error('Error updating training:', error);
                this.openSnackBar('Error updating training', 'Close');
              },
            });
        } else {
          this.trainingApiService
            .createTraining(
              trainingData,
              departmentsData,
              employeesData,
              this.sections
            )
            .subscribe({
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
          // Adaugăm un mesaj de eroare pentru utilizator, dacă formularul este invalid
          // this.openSnackBar(
          //   'Invalid form data. Please check the form again.',
          //   'Close'
          // );
        }
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

    if (this.isWorkshop && this.trainer.length !== 1) {
      this.setTrainerError();
      valid = false;
    } else {
      this.removeTrainerError();
    }

    return valid;
  }

  public addSection() {
    const sectionTitleControlName = `sectionTitle${this.sections.length}`;
    const titleControl = new FormControl('', Validators.required);
    (this.trainingForm as FormGroup).addControl(
      sectionTitleControlName,
      titleControl
    );

    const sectionDescrControlName = `sectionDescription${this.sections.length}`;
    const descriptionControl = new FormControl('', Validators.required);
    (this.trainingForm as FormGroup).addControl(
      sectionDescrControlName,
      descriptionControl
    );

    this.sections.push({
      sectionId: 0,
      title: '',
      description: '',
    });

  }
  

  ngOnDestroy() {
    this.subscriptions.forEach((sub) => sub.unsubscribe());
  }
}

