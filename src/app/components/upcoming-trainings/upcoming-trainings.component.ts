import { AsyncPipe } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { Observable, Subscription, of } from 'rxjs';
import { TrainingsService } from '../../services/trainings.service';
import { TrainingInterface } from '../../interfaces/training.interface';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-upcoming-trainings',
  standalone: true,
  imports: [AsyncPipe, RouterLink],
  templateUrl: './upcoming-trainings.component.html',
  styleUrl: './upcoming-trainings.component.css',
})
export class UpcomingTrainingsComponent implements OnInit {
  trainingsApiService = inject(TrainingsService);
  authService = inject(AuthService);
  private subscriptions: Subscription[] = [];

  public upcomingTrainings$!: Observable<TrainingInterface[]>;

  ngOnInit(): void {
    const roleSubscription = this.authService.rolesource.subscribe((role) => {
      if (role === 'admin') {
        this.upcomingTrainings$ =
          this.trainingsApiService.getUpcomingTrainings();
      } else {
        const sessionAuthUser = sessionStorage.getItem('authUser');
        if (sessionAuthUser) {
          const objSessionAuthUser = JSON.parse(sessionAuthUser);
          if (objSessionAuthUser?.uid) {
            this.upcomingTrainings$ =
              this.trainingsApiService.getUpcomingTrainingsByEmployee(
                0,
                objSessionAuthUser?.uid
              );
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
