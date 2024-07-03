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
      if (role === 'admin') {
        this.adminVersion = true;
      } else {
        this.adminVersion = false;
      }
    });
    this.subscriptions?.push(roleSubscription);

    const getTrainingsSubscription = this.trainingsService
      .getTrainings()
      .subscribe((trainings: any) => {
        this.trainings = trainings;
        console.log(this.trainings);
      });

    this.subscriptions?.push(getTrainingsSubscription);
  }

  ngOnDestroy(): void {
    this.subscriptions?.forEach((subscription) => subscription.unsubscribe());
  }
  public onTrainingsChange(trainingId : number): void {
      this.trainings = this.trainings.filter((training) => training.trainingId != trainingId)
  }
  
}
