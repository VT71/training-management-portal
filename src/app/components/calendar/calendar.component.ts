// calendar.component.ts
import {
  Component,
  InputSignal,
  signal,
  input,
  Signal,
  WritableSignal,
  computed,
  Input,
  OnInit,
} from '@angular/core';
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
export class CalendarComponent  {
  @Input()
  get trainings(): TrainingInterface[] {
    return this._trainings;
  }
  set trainings(value: TrainingInterface[]) {
    this._trainings = value;
  }
  public _trainings: TrainingInterface[] = [];

  public today: Signal<DateTime> = signal(DateTime.local());
  public firstDayOfActiveMonth: WritableSignal<DateTime> = signal(
    this.today().startOf('month')
  );

  public activeDay: WritableSignal<DateTime | null> = signal(null);
  public weekDays: Signal<string[]> = signal(Info.weekdays('short'));
  public isHoveringOnChild: boolean = false;

  // ngOnInit() {
  //   console.log(this._trainings);
  // }

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
  
    return this.trainings.filter((training) => {
      
      const trainingDeadline = training.deadline.substring(0, 10);
      return trainingDeadline === activeDayISO;
    });
  });

  constructor(private router: Router, public dialog: MatDialog) {}

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
    const events = this._trainings
      .filter(training => {
        const deadlineDate = training.deadline.substring(0, 10);
        return deadlineDate === day.toISODate();
      })
      .map(training => training.title);
    
    // Verifică dacă se găsesc evenimentele pentru ziua respectivă
  
    return events;
  }

  openDialog(event: Event): void {
    const dialogRef = this.dialog.open(DialogContentExampleDialog, {
      data: { type: 'add' },
    });
    event.stopPropagation();
    dialogRef.afterClosed().subscribe((result) => {});
  }

  openDialogEdit(event: Event): void {
    const dialogRef = this.dialog.open(DialogContentExampleDialog, {
      data: { type: 'edit' },
    });
    event.stopPropagation();
    dialogRef.afterClosed().subscribe((result) => {});
  }

  public openConfirmDialog(event: Event): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent);

    event.stopPropagation();
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        // Logică pentru ștergere
      }
    });
  }
}
