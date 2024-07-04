import { Component, Input, inject } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Observable, Subscription } from 'rxjs';
import { TrainingInterface } from '../interfaces/training.interface';
import { TrainingsService } from '../services/trainings.service';
import { AsyncPipe } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-trainings-list',
  standalone: true,
  imports: [AsyncPipe, RouterLink],
  templateUrl: './trainings-list.component.html',
  styleUrl: './trainings-list.component.css',
})
export class TrainingsListComponent {
  @Input()
  get type(): string {
    return this._type;
  }
  set type(value: string) {
    this._type = value;
    this.updateTrainings();
  }
  private _type = '';

  trainingsApiService = inject(TrainingsService);
  authService = inject(AuthService);

  private subscriptions: Subscription[] = [];

  public trainings$!: Observable<TrainingInterface[]>;

  public header = '';

  ngOnInit(): void {
    this.updateTrainings();
  }

  private updateTrainings() {
    const roleSubscription = this.authService.rolesource.subscribe((role) => {
      if (role === 'admin') {
        switch (this.type) {
          case 'missed':
            this.header = 'Missed Trainings';
            this.trainings$ = this.trainingsApiService.getMissedTrainings();
            break;
          case 'upcoming':
            this.header = 'Upcoming Trainings';
            this.trainings$ = this.trainingsApiService.getUpcomingTrainings();
            break;
        }
      } else {
        const sessionAuthUser = sessionStorage.getItem('authUser');
        if (sessionAuthUser) {
          const objSessionAuthUser = JSON.parse(sessionAuthUser);
          if (objSessionAuthUser?.uid) {
            switch (this._type) {
              case 'missed':
                this.header = 'Missed Trainings';
                this.trainings$ =
                  this.trainingsApiService.getMissedTrainingsByEmployee(
                    0,
                    objSessionAuthUser?.uid
                  );
                break;
              case 'completed':
                this.header = 'Completed Trainings';
                this.trainings$ =
                  this.trainingsApiService.getCompletedTrainingsByEmployee(
                    0,
                    objSessionAuthUser?.uid
                  );
                break;
              case 'in-progress':
                this.header = 'In Progress Trainings';
                this.trainings$ =
                  this.trainingsApiService.getInProgressTrainingsByEmployee(
                    0,
                    objSessionAuthUser?.uid
                  );
                break;
              case 'upcoming':
                this.header = 'Upcoming Trainings';
                this.trainings$ =
                  this.trainingsApiService.getUpcomingTrainingsByEmployee(
                    0,
                    objSessionAuthUser?.uid
                  );
                break;
            }
          }
        }
      }
    });
    this.subscriptions?.push(roleSubscription);
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
