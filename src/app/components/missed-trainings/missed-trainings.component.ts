import { Component, OnInit, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { TrainingsService } from '../../services/trainings.service';
import { Observable } from 'rxjs';
import { TrainingInterface } from '../../interfaces/training.interface';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-missed-trainings',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, AsyncPipe],
  templateUrl: './missed-trainings.component.html',
  styleUrl: './missed-trainings.component.css',
})
export class MissedTrainingsComponent implements OnInit {
  trainingsApiService = inject(TrainingsService);

  public missedTrainings$!: Observable<TrainingInterface[]>;

  ngOnInit(): void {
    this.missedTrainings$ = this.trainingsApiService.getMissedTrainings();
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
