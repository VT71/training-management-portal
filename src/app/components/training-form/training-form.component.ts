import { Component,  } from '@angular/core';
import {MatIconModule} from '@angular/material/icon';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';

@Component({
  selector: 'app-training-form',
  standalone: true,
  imports: [MatFormFieldModule, MatInputModule, MatIconModule],
  templateUrl: './training-form.component.html',
  styleUrl: './training-form.component.css'
})
export class TrainingFormComponent {

}
