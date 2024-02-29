import { Component, OnInit, OnDestroy } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subject, takeUntil } from 'rxjs';
import { Task } from "./task"
import { TaskService } from './task.service';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatButtonModule } from '@angular/material/button';
import { RouterLink } from '@angular/router';
import { MatListModule } from '@angular/material/list';
import { TaskElementComponent } from './task-element.component';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { map, switchMap } from 'rxjs/operators';
import { MatRadioModule } from '@angular/material/radio';
import { MatOptionModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-edit-hunt-component',
  templateUrl: 'edit-hunt.component.html',
  styleUrls: ['edit-hunt.component.scss'],
  providers: [],
    standalone: true,
    imports: [MatCardModule, MatFormFieldModule, MatInputModule, FormsModule, MatSelectModule, MatOptionModule, MatRadioModule, TaskElementComponent, MatListModule, RouterLink, MatButtonModule, MatTooltipModule, MatIconModule]
})

export class EditHuntComponent implements OnInit, OnDestroy {
public serverFilteredTasks: Task[];

public taskDescription: string;
public taskHuntId: string;
public taskPosition: number;

errMsg = '';
private ngUnsubscribe = new Subject<void>();




  /**
   * @param userService the `UserService` used to get users from the server
   * @param snackBar the `MatSnackBar` used to display feedback
   */
  constructor(private taskService: TaskService, private snackBar: MatSnackBar, private route: ActivatedRoute) {
  }

getTasksFromServer(huntId): void {
this.taskService.getTasks(huntId)
.pipe(
  takeUntil(this.ngUnsubscribe)
).subscribe({
  next: (returnedTasks) => {
    this.serverFilteredTasks = returnedTasks;
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
    this.route.paramMap.pipe(
      map((paramMap: ParamMap) => paramMap.get('huntId')),
      switchMap((huntId: string) => this.taskService.getTasks(huntId)
    )
    )}

ngOnDestroy() {
  this.ngUnsubscribe.next();
  this.ngUnsubscribe.complete();
}

}
