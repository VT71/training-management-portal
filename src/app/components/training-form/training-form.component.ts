import { Component,  } from '@angular/core';
import {MatIconModule} from '@angular/material/icon';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatDatepickerModule} from '@angular/material/datepicker';
import { provideNativeDateAdapter } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';
import {MatSelectModule} from '@angular/material/select';
import { ChipsAutocompleteComponent } from './chips-autocomplete/chips-autocomplete.component';
import {MatButtonToggleModule} from '@angular/material/button-toggle';

@Component({
  selector: 'app-training-form',
  standalone: true,
  imports: [MatFormFieldModule, MatInputModule, MatIconModule, MatDatepickerModule,  MatButtonModule, MatSelectModule, ChipsAutocompleteComponent, MatButtonToggleModule],
  templateUrl: './training-form.component.html',
  styleUrl: './training-form.component.css',
  providers: [provideNativeDateAdapter()],
})
export class TrainingFormComponent {


}
