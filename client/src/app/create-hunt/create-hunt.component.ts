import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Hunt } from '../hunt/hunt';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, FormsModule } from '@angular/forms';
import { MatCard } from '@angular/material/card';

@Component({
  selector: 'app-create-hunt',
  templateUrl: './create-hunt.component.html',
  styleUrls: ['./create-hunt.component.scss'],
  imports: [CommonModule, FormsModule, MatCard],
  standalone: true
})


// In your component class
export class CreateHuntComponent {
  huntForm: FormGroup;

  constructor(private httpClient: HttpClient, private fb: FormBuilder) {
    this.huntForm = this.fb.group({
      name: ['', Validators.required],
      description: ['', Validators.required],
      ownerId: ['', Validators.required]
    });
  }

  onSubmit(): void {
    if (this.huntForm.valid) {
      const formData = this.huntForm.value;
      // Submit the form data to your backend or perform any necessary action
      console.log(formData);
    } else {
      // Handle form validation errors
    }
  }

   hunt: Hunt = {
     name: '',
     description: '',
     ownerId: '',
     _id: ''
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
      _id: ''
    };
  }
}
