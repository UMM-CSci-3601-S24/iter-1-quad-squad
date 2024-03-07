import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormControl, FormGroup, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { TaskService } from './task.service';
import { Subject, takeUntil } from 'rxjs';
import { MatButtonModule } from '@angular/material/button';
import { MatOptionModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';

import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCardModule } from '@angular/material/card';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';

@Component({
  selector: 'app-add-task',
  templateUrl: 'add-task.component.html',
  styleUrls: ['add-task.component.scss'],
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, MatCardModule, MatFormFieldModule, MatInputModule, MatSelectModule, MatOptionModule, MatButtonModule]
})

export class AddTaskComponent implements OnInit, OnDestroy {
  constructor(
    private route: ActivatedRoute,
    private taskService: TaskService,
    private snackBar: MatSnackBar,
    private router: Router,
    private location: Location){}

  public usedHuntId: string = 'bla'
  public positionNumber: number = 0


  private ngUnsubscribe = new Subject<void>();
  errMsg = '';

  addTaskForm = new FormGroup({

    description: new FormControl('', Validators.compose([
      Validators.required,
      Validators.minLength(2),
      Validators.maxLength(200)
    ])),

    huntId: new FormControl('placeholderID'),

    position: new FormControl(this.positionNumber, Validators.max(100))
  });


addTaskFormFunction(): void{
this.addTaskForm.controls['huntId'].setValue(this.usedHuntId);
this.addTaskForm.controls['position'].setValue(this.positionNumber);
}
  readonly addTaskValidationMessages = {
    description: [
      {type: 'required', message: 'Description is required'},
      {type: 'minlength', message: 'Description must be at least 2 characters long'},
      {type: 'maxlength', message: 'Description cannot be more than 200 characters long'}
    ],
    position: [
      {type: 'max', message: 'cannot have more than 100 tasks'}
    ]
  }

  formControlHasError(controlName: string): boolean {
    return this.addTaskForm.get(controlName).invalid &&
      (this.addTaskForm.get(controlName).dirty || this.addTaskForm.get(controlName).touched);
  }

  getErrorMessage(name: keyof typeof this.addTaskValidationMessages): string {
    for(const {type, message} of this.addTaskValidationMessages[name]) {
      if (this.addTaskForm.get(name).hasError(type)) {
        return message;
      }
    }
    return 'Unknown error';
  }

  submitForm() {
    this.taskService.addTask(this.addTaskForm.value, this.usedHuntId).subscribe({
      next: () => {
        this.snackBar.open(
          `Added task`,
          null,
          { duration: 2000 }
        );
        this.router.navigate(['/tasks/', this.usedHuntId]);
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
  goBack(): void {
    this.location.back();
  }
  getTaskAttributesFromServer(): void {
    console.log("In getTaskAttributesFromServer");
    this.usedHuntId = this.route.snapshot.params['huntId']
    console.log(this.usedHuntId);
    this.taskService.getTasks(this.usedHuntId)
    .pipe(
      takeUntil(this.ngUnsubscribe)
    ).subscribe({
      next: (returnedTasks) => {
        this.positionNumber = returnedTasks.length + 1
        this.addTaskFormFunction();
      },
      error: (err) => {
        if (err.error instanceof ErrorEvent) {
          this.errMsg = `Problem in the client – Error: ${err.error.message}`;
        } else {
          this.errMsg = `Problem contacting the server – Error Code: ${err.status}\nMessage: ${err.message}`;
        }
        this.snackBar.open(
          this.errMsg,
          'OK',
          // The message will disappear after 6 seconds.
          { duration: 6000 });
      },
    });
  }

  ngOnInit(): void {
    this.getTaskAttributesFromServer()
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }
}
