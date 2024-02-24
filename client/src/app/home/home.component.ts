import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';

@Component({
    selector: 'app-home-component',
    templateUrl: 'home.component.html',
    styleUrls: ['./home.component.scss'],
    providers: [],
    standalone: true,
    imports: [MatCardModule]
})

export class HomeComponent {
  constructor(private router: Router) { } // Inject the Router service

  hostLogin() {
    // Redirect to the login page
    this.router.navigate(['/login']);
}
}
