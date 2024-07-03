import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { TrainingsService } from '../../services/trainings.service';
import { Observable, Subscription } from 'rxjs';
import { TrainingInterface } from '../../interfaces/training.interface';
import { AsyncPipe } from '@angular/common';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-missed-trainings',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, AsyncPipe],
  templateUrl: './missed-trainings.component.html',
  styleUrl: './missed-trainings.component.css',
})
export class MissedTrainingsComponent implements OnInit, OnDestroy {
  trainingsApiService = inject(TrainingsService);
  authService = inject(AuthService);
  subscriptions: Subscription[] = [];

  public missedTrainings$!: Observable<TrainingInterface[]>;

  ngOnInit(): void {
    const roleSubscription = this.authService.rolesource.subscribe((role) => {
      let userId = undefined;
      if (role === 'admin') {
        this.missedTrainings$ = this.trainingsApiService.getMissedTrainings();
      } else {
        const sessionAuthUser = sessionStorage.getItem('authUser');
        if (sessionAuthUser) {
          const objSessionAuthUser = JSON.parse(sessionAuthUser);
          if (objSessionAuthUser?.uid) {
            this.missedTrainings$ =
              this.trainingsApiService.getMissedTrainingsByEmployee(
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

  ngOnDestroy(): void {
    this.subscriptions?.forEach((subscription) => subscription.unsubscribe());
  }
}
