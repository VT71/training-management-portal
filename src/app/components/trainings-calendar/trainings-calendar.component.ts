// trainings-calendar.component.ts
import { Component } from '@angular/core';
import { CalendarComponent } from '../calendar/calendar.component';


export const colors: any = {};

@Component({
  selector: 'app-trainings-calendar',
  standalone: true,
  imports: [CalendarComponent],
  templateUrl: './trainings-calendar.component.html',
  styleUrls: ['./trainings-calendar.component.css'],
})
export class TrainingsCalendarComponent {
  constructor() {}

  meetings = {
    '2024-04-05': ['Dring Coffee', 'Learn React', 'Sleep'],
    '2024-04-06': ['Dring Coffee', 'Learn Angular', 'Sleep'],
    '2024-06-05': ['Implementation', 'Development', 'SaaS'],
    '2024-06-06': ['Implementation', 'Development', 'SaaS'],
  };
}
