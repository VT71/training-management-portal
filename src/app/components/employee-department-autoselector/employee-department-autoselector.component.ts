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
import { Observable, Subscription } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { MatIconModule } from '@angular/material/icon';
import { AsyncPipe, NgClass } from '@angular/common';
import { MatError, MatFormFieldModule } from '@angular/material/form-field';
import { LiveAnnouncer } from '@angular/cdk/a11y';
import { DepartmentsApiService } from '../../services/departments-api.service';
import { Department } from '../../interfaces/department';
import { MatInputModule } from '@angular/material/input';

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
  @Input() type!: 'Departments' | 'Employees';
  @Output() valuesEmitter = new EventEmitter<number[]>();

  private departmentsApiService = inject(DepartmentsApiService);
  private subscriptions: Subscription[] = [];

  separatorKeysCodes: number[] = [ENTER, COMMA];
  formCtrl = new FormControl('', [Validators.required]);
  filteredValues: Observable<string[]>;
  selectedValues: string[] = [];
  allValues: string[] = [];

  private apiDepartments: Department[] = [];
  private apiEmployees: Department[] = [];

  @ViewChild('selectorInput') selectorInput!: ElementRef<HTMLInputElement>;

  announcer = inject(LiveAnnouncer);

  constructor() {
    this.filteredValues = this.formCtrl.valueChanges.pipe(
      startWith(null),
      map((value: string | null) =>
        value ? this._filter(value) : this.allValues.slice()
      )
    );
  }

  ngOnInit(): void {
    if (this.type === 'Departments') {
      const getDepartmentsSubscriptions = this.departmentsApiService
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

          this.filteredValues = this.formCtrl.valueChanges.pipe(
            startWith(null),
            map((value: string | null) =>
              value ? this._filter(value) : this.allValues.slice()
            )
          );
        });
      this.subscriptions.push(getDepartmentsSubscriptions);
    }
  }

  add(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();

    // Add our value
    if (value) {
      this.selectedValues.push(value);
    }

    // Clear the input value
    event.chipInput!.clear();

    this.formCtrl.setValue(null);
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
    this.valuesEmitter.emit(tempArray);
  }
}
