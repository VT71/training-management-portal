// trainings-calendar.component.ts
import { Component , OnInit} from '@angular/core';
import { CalendarComponent } from '../calendar/calendar.component';
import { TrainingsService } from '../../services/trainings.service';
import { TrainingInterface } from '../../interfaces/training.interface';


export const colors: any = {};

@Component({
  selector: 'app-trainings-calendar',
  standalone: true,
  imports: [CalendarComponent, ],
  templateUrl: './trainings-calendar.component.html',
  styleUrls: ['./trainings-calendar.component.css'],
})
export class TrainingsCalendarComponent implements OnInit {
 trainings: TrainingInterface[] = [];

  constructor(private trainingsService: TrainingsService) {}
  
  ngOnInit() {
    this.trainingsService.getTrainings().subscribe((trainings: any) => {
      this.trainings = trainings;
      console.log(this.trainings);
    });
  }

  public onTrainingsChange(trainingId : number): void {
      this.trainings = this.trainings.filter((training) => training.trainingId != trainingId)
  }
  
}
