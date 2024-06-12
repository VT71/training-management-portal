import { Component, OnDestroy, OnInit } from '@angular/core';
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

@Component({
  selector: 'app-training-form',
  standalone: true,
  imports: [
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
  ],
  templateUrl: './training-form.component.html',
  styleUrl: './training-form.component.css',
  providers: [provideNativeDateAdapter()],
})
export class TrainingFormComponent implements OnDestroy {
  trainingForm: FormGroup = new FormGroup({});

  constructor(
    private fb: FormBuilder,
    private trainingApiService: TrainingsService
  ) {
    this.trainingForm = this.fb.group({
      title: ['', [Validators.required, Validators.maxLength(255)]],
      description: ['', Validators.required],
      online: [true, Validators.required],
      deadline: ['', Validators.required],
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
    } else {
      console.log('invalid');
    }
    const { title, description, online, deadline } = this.trainingForm.value;

    const trainingData = {
      title,
      description,
      online: 1,
      deadline: 'jjh',
    };

    this.trainingApiService
      .createTraining(trainingData as TrainingInterface)
      .subscribe({
        next: () => {
          console.log('Training created successfully');
          // Poți face un redirect către o altă pagină sau să faci alte acțiuni după ce training-ul a fost actualizat
        },
        error: (error) => {
          console.error('Error creating training:', error);
          // Poți trata eroarea în funcție de necesități
        },
      });
  }

  resetForm() {
    this.trainingForm.reset();
  }
  
  ngOnDestroy() {
    this.subscriptions.forEach((sub) => sub.unsubscribe());
  }
}
