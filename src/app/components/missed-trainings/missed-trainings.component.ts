import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-missed-trainings',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './missed-trainings.component.html',
  styleUrl: './missed-trainings.component.css'
})
export class MissedTrainingsComponent {

}
