// calendar.component.ts
import { Component, InputSignal, signal, input, Signal, WritableSignal, computed } from '@angular/core';
import { Meetings } from './meetings.interface';
import { DateTime, Info, Interval } from 'luxon';
import { CommonModule } from '@angular/common';
import { MatIcon, MatIconModule } from '@angular/material/icon';


@Component({
  selector: 'app-calendar',
  standalone: true,
  imports: [CommonModule, MatIcon, MatIconModule],
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.css']
})
export class CalendarComponent {
  public meetings: InputSignal<Meetings> = input.required();
  public today: Signal<DateTime> = signal(DateTime.local());
  public firstDayOfActiveMonth: WritableSignal<DateTime> = signal(this.today().startOf('month'));

  public activeDay: WritableSignal<DateTime | null> = signal(null);
  public weekDays: Signal<string[]> = signal(Info.weekdays('short'));
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

  // icon add-training
  public showIcon: boolean = false;
  public hoveredDay: WritableSignal<DateTime | null> = signal(null);

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

  public toggleIconVisibility(visible: boolean): void {
    this.showIcon = visible;
  }

  public toggleHoveredDay(day: DateTime | null): void {
    this.hoveredDay.set(day);
  }
}
