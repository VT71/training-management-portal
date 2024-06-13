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
import { NgxMaterialTimepickerModule } from 'ngx-material-timepicker';
import { BrowserModule } from '@angular/platform-browser';
import { MatTooltipModule } from '@angular/material/tooltip';

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
    MatTooltipModule
    
  ],
  templateUrl: './training-form.component.html',
  styleUrl: './training-form.component.css',
  providers: [provideNativeDateAdapter()],
})
export class TrainingFormComponent implements OnDestroy {
  @Input() type!: string;

  ngOnInit() {
    console.log(this.type);
  }

  trainingForm: FormGroup = new FormGroup({});

  constructor(
    private fb: FormBuilder,
    private trainingApiService: TrainingsService
  ) {
    this.trainingForm = this.fb.group({
      title: ['', [Validators.required, Validators.maxLength(255)]],
      description: ['', Validators.required],
      online: [1, Validators.required],
      deadline: ['formattedDeadline', Validators.required],
      time: ['', Validators.required],
    });
  }

  private subscriptions: Subscription[] = [];
  public trainingId!: number;
  public training$!: Observable<TrainingInterface>;

  onSubmitTrainings() {
    // Subscribe to form changes
    if (this.trainingForm.valid) {
      console.log('valid');
      const rawForm = this.trainingForm.getRawValue();
      console.log(rawForm);

      const formattedDeadline = this.formatDateForAzure(rawForm.deadline, rawForm.time);

      const { title, description, } = this.trainingForm.value;

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

  public formatDateForAzure(dateString: string, timeString: string): string {
    
    let date = new Date(dateString);

    let year = date.getFullYear();
    let month = String(date.getMonth() + 1).padStart(2, '0'); 
    let day = String(date.getDate()).padStart(2, '0');
    
    let [hours, minutes] = timeString.split(':');
    let seconds = '00'; // Poți adăuga secunde dacă este necesar
    let milliseconds = '000'
    // Combinăm componentele într-un singur string
    return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}.${milliseconds}Z`;
}

  
  ngOnDestroy() {
    this.subscriptions.forEach((sub) => sub.unsubscribe());
  }
}
