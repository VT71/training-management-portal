// trainings-calendar.component.ts
import { Component, OnInit } from '@angular/core';
import { CalendarComponent } from '../calendar/calendar.component';
import { Meetings } from '../calendar/meetings.interface';


export const colors: any = {};

@Component({
  selector: 'app-trainings-calendar',
  standalone: true,
  imports: [CalendarComponent],
  templateUrl: './trainings-calendar.component.html',
  styleUrls: ['./trainings-calendar.component.css'],
})
export class TrainingsCalendarComponent implements OnInit {
  meetingsData!: Meetings; // Definite assignment assertion

  constructor() {}

  ngOnInit(): void {
    // Initialize meetingsData with actual data
    this.meetingsData = {
      
      // Add more data as needed
    };
  }
}
