import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { Component, ElementRef, Input, ViewChild, inject } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  MatAutocompleteSelectedEvent,
  MatAutocompleteModule,
} from '@angular/material/autocomplete';
import { MatChipInputEvent, MatChipsModule } from '@angular/material/chips';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { MatIconModule } from '@angular/material/icon';
import { AsyncPipe } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { LiveAnnouncer } from '@angular/cdk/a11y';

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
  ],
  templateUrl: './employee-department-autoselector.component.html',
  styleUrl: './employee-department-autoselector.component.css',
})
export class EmployeeDepartmentAutoselectorComponent {
  @Input() type!: 'Departments' | 'Employees';

  separatorKeysCodes: number[] = [ENTER, COMMA];
  formCtrl = new FormControl('');
  filteredValues: Observable<string[]>;
  selectedValues: string[] = ['Lemon'];
  allValues: string[] = ['Apple', 'Lemon', 'Lime', 'Orange', 'Strawberry'];

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
  }

  selected(event: MatAutocompleteSelectedEvent): void {
    this.selectedValues.push(event.option.viewValue);
    this.selectorInput.nativeElement.value = '';
    this.formCtrl.setValue(null);
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.allValues.filter((value) =>
      value.toLowerCase().includes(filterValue)
    );
  }
}
