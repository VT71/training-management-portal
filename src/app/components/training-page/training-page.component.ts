import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TrainingsService } from '../../services/trainings.service';
import { CommonModule } from '@angular/common';
import { TrainingInterface } from '../../interfaces/training.interface';

@Component({
  selector: 'app-training-page',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './training-page.component.html',
  styleUrl: './training-page.component.css',
})
export class TrainingPageComponent implements OnInit {
  public trainingId: number;
  public training!: TrainingInterface;
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
    this.fetchTrainingDetails();
  }

  fetchTrainingDetails(): void {
    this.trainingService.getTrainingById(this.trainingId).subscribe(
      (training: TrainingInterface) => {
        this.training = training;
       
      },
      (error) => {
        console.error('Error fetching training:', error);
        this.loading = false; 
        this.errorLoading = true; 
      }
    );
  }

  
}
