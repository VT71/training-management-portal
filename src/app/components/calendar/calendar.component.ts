// calendar.component.ts
import {
  Component,
  signal,
  Signal,
  WritableSignal,
  computed,
  Input,
  Output,
  EventEmitter,
  OnDestroy,
  inject,
} from '@angular/core';
import { tap, catchError } from 'rxjs/operators';
import { TrainingInterface } from '../../interfaces/training.interface';
import { DateTime, Info, Interval } from 'luxon';
import { CommonModule } from '@angular/common';
import { MatIcon, MatIconModule } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { MatTooltipModule } from '@angular/material/tooltip';
import { TrainingFormComponent } from '../training-form/training-form.component';
import { DialogContentExampleDialog } from './dialog-component/dialog-component.component';
import { MatDialog } from '@angular/material/dialog';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { ConfirmDialogComponent } from './confirm-dialog.component';
import { TrainingsService } from '../../services/trainings.service';
import { MatSnackBar, MatSnackBarRef } from '@angular/material/snack-bar';
import { Subscription } from 'rxjs';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-calendar',
  standalone: true,
  imports: [
    CommonModule,
    MatIcon,
    MatIconModule,
    FormsModule,
    MatTooltipModule,
    TrainingFormComponent,
    RouterLink,
    RouterLinkActive,
    MatButtonModule,
    MatMenuModule,
  ],
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.css'],
})
export class CalendarComponent implements OnDestroy {
  trainingsApiService: any;
  @Output() valuesEmitter = new EventEmitter<number>();
  authService = inject(AuthService);

  @Input()
  get trainings(): TrainingInterface[] {
    return this._trainings();
  }

  set trainings(value: TrainingInterface[]) {
    this._trainings.set(value);
  }
  public _trainings: WritableSignal<TrainingInterface[]> = signal([]);
  public trainingId!: number;

  public today: Signal<DateTime> = signal(DateTime.local());
  public firstDayOfActiveMonth: WritableSignal<DateTime> = signal(
    this.today().startOf('month')
  );

  public activeDay: WritableSignal<DateTime | null> = signal(null);
  public weekDays: Signal<string[]> = signal(Info.weekdays('short'));
  public isHoveringOnChild: boolean = false;

  private subscriptions: Subscription[] = [];

  public adminVersion = false;

  public hoveredEventsCount: number = 0;

  public getTooltipMessage(day: DateTime): string {
    const eventsCount = this.getEventsForDay(day).length;
    if (eventsCount === 0) {
      return 'No events in this day';
    } else if (eventsCount === 1) {
      return '1 event in this day';
    } else {
      return `${eventsCount} events in this day`;
    }
  }

  public daysOfMonth: Signal<DateTime[]> = computed(() => {
    return Interval.fromDateTimes(
      this.firstDayOfActiveMonth().startOf('week'),
      this.firstDayOfActiveMonth().endOf('month').endOf('week')
    )
      .splitBy({ day: 1 })
      .map((d) => {
        if (d.start === null) {
          throw new Error('Wrong dates');
        }
        return d.start;
      });
  });

  public DATE_MED = DateTime.DATE_MED;

  public activeDayTrainings: Signal<TrainingInterface[]> = computed(() => {
    const activeDay = this.activeDay();
    if (activeDay === null) {
      return [];
    }

    const activeDayISO = activeDay.toISODate();
    if (!activeDayISO) {
      return [];
    }

    if (this.trainings.length >= 0) {
      return this.trainings.filter((training) => {
        const trainingDeadline = training.deadline.substring(0, 10);
        return trainingDeadline === activeDayISO;
      });
    } else {
      return [];
    }
  });

  constructor(
    private router: Router,
    public dialog: MatDialog,
    private _snackBar: MatSnackBar,
    private trainingsService: TrainingsService
  ) {}

  public goToPreviousMonth(): void {
    this.firstDayOfActiveMonth.set(
      this.firstDayOfActiveMonth().minus({ month: 1 })
    );
  }

  public goToNextMonth(): void {
    this.firstDayOfActiveMonth.set(
      this.firstDayOfActiveMonth().plus({ month: 1 })
    );
  }

  public goToCurrentMonth(): void {
    this.firstDayOfActiveMonth.set(this.today().startOf('month'));
  }

  public goToToday(): void {
    const today = this.today();
    this.firstDayOfActiveMonth.set(this.today().startOf('month'));
    this.activeDay.set(today);
  }

  public getEventsForDay(day: DateTime): string[] {
    const events = this._trainings()
      .filter((training) => {
        const deadlineDate = training.deadline.substring(0, 10);
        return deadlineDate === day.toISODate();
      })
      .map((training) => training.title)
      .slice(0, 5);

    // Verifică dacă se găsesc evenimentele pentru ziua respectivă
    return events;
  }

  public openDialog(event: Event): void {
    const selectedDate = this.activeDay()?.toISODate();

    const dialogRef = this.dialog.open(DialogContentExampleDialog, {
      width: '650px',
      height: '640px',
      data: { type: 'add', selectedDate },
    });
    event.stopPropagation();
    dialogRef.afterClosed().subscribe((result) => {
    });
  }

  public openDialogEdit(event: Event, trainingId: number): void {
    event.stopPropagation();
    const getTrainingSubscription = this.trainingsService
      .getTrainingById(trainingId)
      .pipe(
        tap((training) => {
          const dialogRef = this.dialog.open(DialogContentExampleDialog, {
            width: '650px',
            height: '634px',
            data: { type: 'edit', trainingId: training.trainingId },
          });

          dialogRef.afterClosed().subscribe((result) => {
            if (result === true) {
              window.location.reload();
            }
          });
        }),
        catchError((error) => {
          console.error('Error fetching training:', error);
          throw error;
        })
      )
      .subscribe();

    this.subscriptions.push(getTrainingSubscription);
  }

  ngOnInit() {
    const roleSubscription = this.authService.rolesource.subscribe((role) => {
      console.log('ROLE IN MENU: ' + role);
      if (role === 'admin') {
        this.adminVersion = true;
      } else {
        this.adminVersion = false;
      }
    });
    this.subscriptions?.push(roleSubscription);
    return;
  }

  public openDeleteDialog(event: Event, trainingId: number): void {
    event.stopPropagation();

    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '350px',
      data: { trainingId: trainingId },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result === true) {
        this.trainingsService.deleteTraining(trainingId).subscribe({
          next: () => {
            const snackBarRef: MatSnackBarRef<any> = this.openSnackBar(
              'Training deleted successfully',
              'Close'
            );
            this.valuesEmitter.emit(trainingId);
            setTimeout(() => {
              snackBarRef.dismiss();
            }, 1500);
            // Așteaptă 2 secunde și apoi reîncarcă pagina
          },
          error: (error) => {
            console.error('Error deleting training:', error);
            this.openSnackBar('Error deleting training', 'Close');
          },
        });
      }
    });
  }

  public resetDay = true;

  openSnackBar(message: string, action: string): MatSnackBarRef<any> {
    return this._snackBar.open(message, action, {
      duration: 1500,
      horizontalPosition: 'right',
      verticalPosition: 'top',
    });
  }

  ngOnDestroy(): void {
    this.subscriptions?.forEach((subscription) => subscription.unsubscribe());
  }
}
