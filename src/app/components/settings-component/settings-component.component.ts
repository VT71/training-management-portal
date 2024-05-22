import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-settings-component',
  standalone: true,
  imports: [ RouterLink, RouterLinkActive ],
  templateUrl: './settings-component.component.html',
  styleUrl: './settings-component.component.css'
})
export class SettingsComponentComponent {

}
