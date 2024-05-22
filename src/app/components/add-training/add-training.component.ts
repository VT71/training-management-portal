import { Component } from '@angular/core';
import { TrainingFormComponent } from '../training-form/training-form.component';

@Component({
  selector: 'app-add-training',
  standalone: true,
  imports: [TrainingFormComponent],
  templateUrl: './add-training.component.html',
  styleUrl: './add-training.component.css',
})
export class AddTrainingComponent {}
