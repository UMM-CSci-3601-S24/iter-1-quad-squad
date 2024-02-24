import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-home-component',
    templateUrl: 'home.component.html',
    styleUrls: ['./home.component.scss'],
    providers: [],
    standalone: true,
    imports: [MatCardModule, CommonModule]
})

export class HomeComponent {
  constructor(private router: Router) { }
  showHunterInput: boolean = false;

  hostLogin() {
    this.router.navigate(['/login']);
}

  showHunterForm() {
    this.showHunterInput = !this.showHunterInput; // Set the flag to the opposite
  }

  submitHunterForm() {
    // NEED TO SEND SOMEWHERE/VALIDATE SOMETHING. DO NOT LEAVE BLANK
  }
}
