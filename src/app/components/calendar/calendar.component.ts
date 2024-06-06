// calendar.component.ts
import {
  Component,
  InputSignal,
  signal,
  input,
  Signal,
  WritableSignal,
  computed,
} from '@angular/core';
import { Meetings } from './meetings.interface';
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
    MatButtonModule, MatMenuModule,
  ],
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.css'],
})
export class CalendarComponent {
  public meetings: InputSignal<Meetings> = input.required();
  public today: Signal<DateTime> = signal(DateTime.local());
  public firstDayOfActiveMonth: WritableSignal<DateTime> = signal(
    this.today().startOf('month')
  );

  public activeDay: WritableSignal<DateTime | null> = signal(null);
  public weekDays: Signal<string[]> = signal(Info.weekdays('short'));
  public isHoveringOnChild: boolean = false;

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

  public activeDayMeetings: Signal<string[]> = computed(() => {
    const activeDay = this.activeDay();
    if (activeDay === null) {
      return [];
    }
    const activeDayISO = activeDay.toISODate();
    if (!activeDayISO) {
      return [];
    }
    return this.meetings()[activeDayISO] ?? [];
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
    const dayISO = day.toISODate();
    if (!dayISO) {
      return [];
    }
    return this.meetings()[dayISO] ?? [];
  }

  openDialog(event: Event): void {
    const dialogRef = this.dialog.open(DialogContentExampleDialog);
    event.stopPropagation();
    dialogRef.afterClosed().subscribe((result) => {});
  }


}
