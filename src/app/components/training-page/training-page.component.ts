import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TrainingsService } from '../../services/trainings.service';
import { CommonModule } from '@angular/common';
import { TrainingInterface } from '../../interfaces/training.interface';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatMenuModule } from '@angular/material/menu';
import { Observable } from 'rxjs';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  selector: 'app-training-page',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatDividerModule,
    MatIconModule,
    MatMenuModule,
    MatTooltipModule,
  ],
  templateUrl: './training-page.component.html',
  styleUrl: './training-page.component.css',
})
export class TrainingPageComponent implements OnInit {
  public trainingId: number;
  public training!: Observable<TrainingInterface>;
  public loading: boolean = true; // Indicator pentru încărcarea datelor
  public errorLoading: boolean = false; // Indicator pentru eroare la încărcare

  constructor(
    private route: ActivatedRoute,
    private trainingService: TrainingsService
  ) {
    const id = this.route.snapshot.paramMap.get('id');
    this.trainingId = id ? +id : 0;
    this.loading = false;
  }

  ngOnInit(): void {
    this.training = this.trainingService.getTrainingById(this.trainingId);
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
}
