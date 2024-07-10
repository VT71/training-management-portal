import { COMMA, ENTER } from '@angular/cdk/keycodes';
import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
  inject,
} from '@angular/core';
import {
  FormControl,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import {
  MatAutocompleteSelectedEvent,
  MatAutocompleteModule,
} from '@angular/material/autocomplete';
import { MatChipInputEvent, MatChipsModule } from '@angular/material/chips';
import { Observable, Subscription, of } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { MatIconModule } from '@angular/material/icon';
import { AsyncPipe, NgClass } from '@angular/common';
import { MatError, MatFormFieldModule } from '@angular/material/form-field';
import { LiveAnnouncer } from '@angular/cdk/a11y';
import { DepartmentsApiService } from '../../services/departments-api.service';
import { Department } from '../../interfaces/department';
import { MatInputModule } from '@angular/material/input';
import { EmployeesApiService } from '../../services/employees-api.service';
import { Employee } from '../../interfaces/employee';
import { EmployeeComplete } from '../../interfaces/employee-complete';

@Component({
  selector: 'app-employee-department-autoselector',
  standalone: true,
  imports: [
    FormsModule,
    MatFormFieldModule,
    MatChipsModule,
    MatIconModule,
    MatAutocompleteModule,
    ReactiveFormsModule,
    AsyncPipe,
    MatError,
    MatInputModule,
    NgClass,
  ],
  templateUrl: './employee-department-autoselector.component.html',
  styleUrl: './employee-department-autoselector.component.css',
})
export class EmployeeDepartmentAutoselectorComponent implements OnInit {
  @Input() type!: 'Departments' | 'Employees' | 'Trainer';
  @Input() operationType!: string;
  @Output() valuesEmitter = new EventEmitter<number[]>();
  @Input() apiSelectedValues!: number[];
  @Input()
  get errorMessage(): string {
    return this._errorMessage;
  }
  set errorMessage(value: string) {
    this._errorMessage = value;
  }
  public _errorMessage = '';

  private departmentsApiService = inject(DepartmentsApiService);
  private employeesApiService = inject(EmployeesApiService);
  private subscriptions: Subscription[] = [];

  separatorKeysCodes: number[] = [ENTER, COMMA];
  formCtrl = new FormControl('', [Validators.required]);
  filteredValues: Observable<string[]>;
  selectedValues: string[] = [];
  allValues: string[] = [];

  private apiDepartments: Department[] = [];
  private apiEmployees: EmployeeComplete[] = [];
  private apiTrainers: EmployeeComplete[] = [];

  @ViewChild('selectorInput') selectorInput!: ElementRef<HTMLInputElement>;

  announcer = inject(LiveAnnouncer);

  public setFormControlValueChange() {
    this.filteredValues = this.formCtrl.valueChanges.pipe(
      startWith(null),
      map((value: string | null) =>
        value ? this._filter(value) : this.allValues.slice()
      )
    );
  }

  constructor() {
    this.filteredValues = of([]);
    this.setFormControlValueChange();
  }

  ngOnInit(): void {
    if (this.type === 'Departments') {
      if (this.operationType === 'edit' && this.apiSelectedValues) {
        this.getApiDepartments(this.apiSelectedValues);
      } else {
        this.getApiDepartments();
      }
    } else if (this.type === 'Employees') {
      if (this.operationType === 'edit' && this.apiSelectedValues) {
        this.getApiEmployees(this.apiSelectedValues);
      } else {
        this.getApiEmployees();
      }
    } else if (this.type === 'Trainer') {
      if (this.operationType === 'edit' && this.apiSelectedValues) {
        this.getApiTrainers(this.apiSelectedValues);
      } else {
        this.getApiTrainers();
      }
    }
  }

  private getApiDepartments(apiValues?: number[]) {
    const getDepartmentsSubscription = this.departmentsApiService
      .getDepartments()
      .subscribe((res: Department[]) => {
        this.apiDepartments = res;
        let tempArray = [];
        for (const department of this.apiDepartments) {
          if (department?.departmentName) {
            tempArray.push(department?.departmentName);
          }
        }
        this.allValues = tempArray;

        if (apiValues) {
          let tempArray = [];
          for (const apiValue of apiValues) {
            const valueToFind = this.apiDepartments.find(
              (apiDepartment) => apiDepartment?.departmentId === apiValue
            );
            if (valueToFind) {
              tempArray.push(valueToFind?.departmentName);
            }
          }
          this.selectedValues = tempArray;
          console.log('SELECTED VALUES: ' + this.selectedValues);
        }
        if (this.operationType === 'edit' && apiValues) {
            this.emitSelectedValues();
        }
        this.setFormControlValueChange();
      });
    this.subscriptions.push(getDepartmentsSubscription);
  }

  private getApiEmployees(apiValues?: number[]) {
    const getEmployeesSubscription = this.employeesApiService
      .getEmployeesComplete()
      .subscribe((res: EmployeeComplete[]) => {
        this.apiEmployees = res;
        let tempArray = [];
        for (const employee of this.apiEmployees) {
          if (employee?.fullName) {
            tempArray.push(employee?.fullName);
          }
        }
        this.allValues = tempArray;

        if (apiValues) {
          let tempArray = [];
          for (const apiValue of apiValues) {
            const valueToFind = this.apiEmployees.find(
              (apiEmployee) => apiEmployee?.employeeId === apiValue
            );
            if (valueToFind) {
              tempArray.push(valueToFind?.fullName);
            }
          }
          this.selectedValues = tempArray;
        }
        if (this.operationType === 'edit' && apiValues) {
            this.emitSelectedValues();
        }
        this.setFormControlValueChange();
      });
    this.subscriptions.push(getEmployeesSubscription);
  }

  private getApiTrainers(apiValues?: number[]) {
    console.log('GETTING TRAINERS: ' + apiValues);
    const getTrainersSubscription = this.employeesApiService
      .getTrainersComplete()
      .subscribe((res: EmployeeComplete[]) => {
        this.apiTrainers = res;
        let tempArray = [];
        for (const trainer of this.apiTrainers) {
          if (trainer?.fullName) {
            tempArray.push(trainer?.fullName);
          }
        }
        this.allValues = tempArray;

        if (apiValues) {
          let tempArray = [];
          for (const apiValue of apiValues) {
            const valueToFind = this.apiTrainers.find(
              (apiTrainer) => apiTrainer?.employeeId === apiValue
            );
            if (valueToFind) {
              tempArray.push(valueToFind?.fullName);
            }
          }
          console.log('TEMP ARRAY: ' + tempArray);
          this.selectedValues = tempArray;
        }

        this.setFormControlValueChange();
        if (this.operationType === 'edit' && apiValues) {
            this.emitSelectedValues();
        }
      });
    this.subscriptions.push(getTrainersSubscription);
  }

  remove(value: string): void {
    const index = this.selectedValues.indexOf(value);

    if (index >= 0) {
      this.selectedValues.splice(index, 1);

      this.announcer.announce(`Removed ${value}`);
    }

    // Emit the new selected values
    this.emitSelectedValues();
  }

  selected(event: MatAutocompleteSelectedEvent): void {
    this.selectedValues.push(event.option.viewValue);
    this.selectorInput.nativeElement.value = '';
    this.formCtrl.setValue(null);

    // Emit the new selected values
    this.emitSelectedValues();
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.allValues.filter((value) =>
      value.toLowerCase().includes(filterValue)
    );
  }

  private emitSelectedValues() {
    let tempArray: number[] = [];

    if (this.type === 'Departments') {
      if (this.apiDepartments?.length > 0) {
        for (const value of this.selectedValues) {
          const apiDepartment = this.apiDepartments.find(
            (department) => department.departmentName === value
          );
          if (apiDepartment) {
            tempArray.push(apiDepartment.departmentId);
          }
        }
      }
    } else if (this.type === 'Employees') {
      if (this.apiEmployees?.length > 0) {
        for (const value of this.selectedValues) {
          const apiEmployee = this.apiEmployees.find(
            (employee) => employee.fullName === value
          );
          if (apiEmployee) {
            tempArray.push(apiEmployee.employeeId);
          }
        }
      }
    } else if (this.type === 'Trainer') {
      if (this.apiTrainers?.length > 0) {
        for (const value of this.selectedValues) {
          const apiTrainer = this.apiTrainers.find(
            (trainer) => trainer.fullName === value
          );
          if (apiTrainer) {
            tempArray.push(apiTrainer.employeeId);
          }
        }
      }
    }

    this.valuesEmitter.emit(tempArray);
  }
}
