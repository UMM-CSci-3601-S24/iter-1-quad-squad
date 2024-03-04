import { Component } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Hunt } from '../hunt/hunt';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, FormsModule } from '@angular/forms';
import { MatCard } from '@angular/material/card';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { HuntService } from '../hunt/hunt.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { RouterTestingModule } from '@angular/router/testing';

@Component({
  selector: 'app-create-hunt',
  templateUrl: './create-hunt.component.html',
  styleUrls: ['./create-hunt.component.scss'],
  imports: [RouterTestingModule, CommonModule, FormsModule, MatCard, RouterModule, HttpClientModule],
  providers: [HttpClient, Router],
  standalone: true
})


// In your component class
export class CreateHuntComponent {
  huntForm: FormGroup;

  constructor(private httpClient: HttpClient, private fb: FormBuilder,
    private route: ActivatedRoute, private huntService: HuntService,
    private snackBar: MatSnackBar, private router: Router) {
    this.huntForm = this.fb.group({
      name: ['', Validators.required],
      description: ['', Validators.required],
      ownerId: ['', Validators.required]
    });
  }


   hunt: Hunt = {
     name: '',
     description: '',
     ownerId: '',
     _id: '',
     id: undefined
   };

   onDescriptionInput(event: Event): void {
    const target = event.target as HTMLTextAreaElement;
    this.hunt.description = target.value;
  }

  onNameInput(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.hunt.name = target.value;
  }

  onOwnerIdInput(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.hunt.ownerId = target.value;
  }

  resetForm(): void {
    this.hunt = {
      name: '',
      description: '',
      ownerId: '',
      _id: '',
      id: undefined
    };
  }

  onSubmit() {
    this.huntService.addHunt(this.huntForm.value).subscribe({
      next: () => {
        this.snackBar.open(
          `Added hunt`,
          null,
          { duration: 2000 }
        );
        this.router.navigate(['/hunts/']);
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
