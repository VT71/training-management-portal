import { AsyncPipe } from '@angular/common';
import { Component } from '@angular/core';
import { of } from 'rxjs';

@Component({
  selector: 'app-upcoming-trainings',
  standalone: true,
  imports: [AsyncPipe],
  templateUrl: './upcoming-trainings.component.html',
  styleUrl: './upcoming-trainings.component.css',
})
export class UpcomingTrainingsComponent {
  test = of([1]);
}
