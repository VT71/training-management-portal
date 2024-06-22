import { AsyncPipe } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { Observable, of } from 'rxjs';
import { TrainingsService } from '../../services/trainings.service';
import { TrainingInterface } from '../../interfaces/training.interface';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-upcoming-trainings',
  standalone: true,
  imports: [AsyncPipe, RouterLink],
  templateUrl: './upcoming-trainings.component.html',
  styleUrl: './upcoming-trainings.component.css',
})
export class UpcomingTrainingsComponent implements OnInit {
  trainingsApiService = inject(TrainingsService);

  public upcomingTrainings$!: Observable<TrainingInterface[]>;

  ngOnInit(): void {
    this.upcomingTrainings$ = this.trainingsApiService.getUpcomingTrainings();
  }

  public convertDate(date: string): string {
    if (date) {
      return (
        date.slice(11, 16) +
        ' ' +
        date.slice(0, 10).split('-').reverse().join('-').replaceAll('-', '/')
      );
    } else {
      return '';
    }
  }
}
