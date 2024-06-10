import { Component, OnDestroy, OnInit,  } from '@angular/core';
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
import { Observable, Subscription,  } from 'rxjs';
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
export class TrainingFormComponent implements OnInit, OnDestroy {

  trainingForm: FormGroup = new FormGroup({});

  constructor(private fb: FormBuilder, private trainingApiService: TrainingsService) {
    this.trainingForm = this.fb.group({
      trainingId: [0, Validators.required],
      title: ['', [Validators.required, Validators.maxLength(255)]],
      description: ['', Validators.required],
      online: [0, Validators.required],
      deadline: ['', Validators.required],
      department: ['', Validators.required],
      employee: ['', Validators.required],
    });
  }

  private subscriptions: Subscription[] = [];
  public trainingId!: number;
  public training$!: Observable<TrainingInterface>;

  ngOnInit() {
    // Subscribe to form changes
    const trainingFormSubscription = this.trainingForm.valueChanges.subscribe((change) => {
      console.log('Form changes:', change);
    });
    this.subscriptions.push(trainingFormSubscription);
  }

  ngOnDestroy() {
    this.subscriptions.forEach((sub) => sub.unsubscribe());
  }

  onSubmitTrainings() {
    const formData = this.trainingForm.value;


    const trainingData: Partial<TrainingInterface> = {
      trainingId: +formData.trainingId,
      title: formData.title,
      description: formData.description,
      online:  +formData.online,
      deadline: formData.deadline,
      department: formData.department,
      employee: formData.employee,
    };

    this.trainingApiService.updateTraining(trainingData as TrainingInterface).subscribe({
      next: () => {
        console.log('Training updated successfully');
        // Poți face un redirect către o altă pagină sau să faci alte acțiuni după ce training-ul a fost actualizat
      },
      error: (error) => {
        console.error('Error updating training:', error);
        // Poți trata eroarea în funcție de necesități
      },
    });
  }

  resetForm() {
    this.trainingForm.reset();
  }
}