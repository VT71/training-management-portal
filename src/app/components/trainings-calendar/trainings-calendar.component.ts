// trainings-calendar.component.ts
import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { CalendarComponent } from '../calendar/calendar.component';
import { TrainingsService } from '../../services/trainings.service';
import { TrainingInterface } from '../../interfaces/training.interface';
import { Subscription } from 'rxjs';
import { AuthService } from '../../services/auth.service';

export const colors: any = {};

@Component({
  selector: 'app-trainings-calendar',
  standalone: true,
  imports: [CalendarComponent],
  templateUrl: './trainings-calendar.component.html',
  styleUrls: ['./trainings-calendar.component.css'],
})
export class TrainingsCalendarComponent implements OnInit, OnDestroy {
  trainings: TrainingInterface[] = [];
  private subscriptions?: Subscription[];
  private authService = inject(AuthService);
  public adminVersion = false;

  constructor(private trainingsService: TrainingsService) {}

  ngOnInit() {
    const roleSubscription = this.authService.rolesource.subscribe((role) => {
      let userId = undefined;
      if (role === 'admin') {
        this.adminVersion = true;
      } else {
        this.adminVersion = false;
        const sessionAuthUser = sessionStorage.getItem('authUser');
        if (sessionAuthUser) {
          const objSessionAuthUser = JSON.parse(sessionAuthUser);
          userId = objSessionAuthUser?.uid ?? undefined;
        }
      }

      const getTrainingsSubscription = this.trainingsService
        .getTrainings(userId)
        .subscribe((trainings: any) => {
          this.trainings = trainings;
          console.log(this.trainings);
        });

      this.subscriptions?.push(getTrainingsSubscription);
    });
    this.subscriptions?.push(roleSubscription);
  }

  ngOnDestroy(): void {
    this.subscriptions?.forEach((subscription) => subscription.unsubscribe());
  }
  public onTrainingsChange(trainingId: number): void {
    this.trainings = this.trainings.filter(
      (training) => training.trainingId != trainingId
    );
  }
}
