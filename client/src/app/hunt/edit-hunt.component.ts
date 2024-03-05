import { Component, OnInit, OnDestroy } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subject, takeUntil } from 'rxjs';
import { Task } from "./task"
import { Hunt } from './hunt';
import { TaskService } from './task.service';
import { HuntService } from './hunt.service';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatButtonModule } from '@angular/material/button';
import { RouterLink } from '@angular/router';
import { MatListModule } from '@angular/material/list';
import { TaskElementComponent } from './task-element.component';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';

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
  public taskHunt: Hunt;
  public taskHuntId: string;
  public taskHuntName: string;
  public taskHuntDescription: string;
  public taskPosition: number;


  errMsg = '';
  private ngUnsubscribe = new Subject<void>();




  /**
   * @param userService the `UserService` used to get users from the server
   * @param snackBar the `MatSnackBar` used to display feedback
   */

  constructor(private router: Router, private taskService: TaskService, private huntService: HuntService, private snackBar: MatSnackBar, private route: ActivatedRoute) {
  }

  getTasksFromServer(): void {
    this.taskService.getTasks(this.taskHuntId)
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

  getHuntFromServer(): void {
    this.route.paramMap.pipe(
      map((paramMap: ParamMap) => paramMap.get('huntId')),
      switchMap((huntId: string) => this.huntService.getHuntById(huntId)),
      takeUntil(this.ngUnsubscribe)
    ).subscribe({
      next: hunt => {
        this.taskHunt = hunt
        this.taskHuntId = this.taskHunt._id
        this.taskHuntName = this.taskHunt.name
        this.taskHuntDescription = this.taskHunt.description
        this.getTasksFromServer()
      },
      // error: (err) => {
      //   if (err.error instanceof ErrorEvent) {
      //     this.errMsg = `Problem in the client – Error: ${err.error.message}`;
      //   } else {
      //     this.errMsg = `Problem contacting the server – Error Code: ${err.status}\nMessage: ${err.message}`;
      //   }
      //   this.snackBar.open(
      //     this.errMsg,
      //     'OK',
      //     // The message will disappear after 6 seconds.
      //     { duration: 10000 });
      // },
    });
  }

  navigateToCreateTask(): void {
    // this.router.navigate(['../','task','new', this.taskHuntId], {relativeTo: this.route});
    this.router.navigateByUrl('/task/new/' + this.taskHuntId);
  }

  ngOnInit(): void {
    this.getHuntFromServer();
  }


  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

}

