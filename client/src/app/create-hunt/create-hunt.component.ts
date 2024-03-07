import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatOptionModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';

import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { HuntService } from '../hunt/hunt.service';
import { Subject } from 'rxjs';
import { ReactiveFormsModule } from '@angular/forms';




@Component({
  selector: 'app-create-hunt',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, MatCardModule, MatFormFieldModule, MatInputModule, MatSelectModule, MatOptionModule, MatButtonModule],
  templateUrl: './create-hunt.component.html',
  styleUrl: './create-hunt.component.scss'
})
export class CreateHuntComponent {

  private ngUnsubscribe = new Subject<void>();
  errMsg = '';

  addHuntForm = new FormGroup({

    name: new FormControl('', Validators.compose([
      Validators.required,
      Validators.minLength(2),
      Validators.maxLength(50),
    ])),

    description: new FormControl('', Validators.compose([
      Validators.required,
      Validators.minLength(2),
      Validators.maxLength(200)
    ])),

    ownerId: new FormControl('defaultOwner')

  });

  readonly addHuntValidationMessages = {
    name: [
      {type: 'required', message: 'Name is required'},
      {type: 'minlength', message: 'Name must be at least 2 characters long'},
      {type: 'maxlength', message: 'Name cannot be more than 50 characters long'},
    ],
    description: [
      {type: 'required', message: 'Description is required'},
      {type: 'minlength', message: 'Description must be at least 2 characters long'},
      {type: 'maxlength', message: 'Description cannot be more than 200 characters long'}
    ]
  }

  constructor(
    private huntService: HuntService,
    private snackBar: MatSnackBar,
    private router: Router,
    ){}

  formControlHasError(controlName: string): boolean {
    return this.addHuntForm.get(controlName).invalid &&
      (this.addHuntForm.get(controlName).dirty || this.addHuntForm.get(controlName).touched);
  }

  getErrorMessage(name: keyof typeof this.addHuntValidationMessages): string {
    for(const {type, message} of this.addHuntValidationMessages[name]) {
      if (this.addHuntForm.get(name).hasError(type)) {
        return message;
      }
    }
    return 'Unknown error';
  }

  submitForm() {
    this.huntService.addHunt(this.addHuntForm.value).subscribe({
      next: () => {
        this.snackBar.open(
          `Added Hunt`,
          null,
          { duration: 2000 }
        );
        this.router.navigate(['/host']);
      },
      error: err => {
        this.snackBar.open(
          `Problem contacting the server – Error Code: ${err.status}\nMessage: ${err.message}`,
          'OK',
          { duration: 5000 }
        );
      },
    });
  }
}
