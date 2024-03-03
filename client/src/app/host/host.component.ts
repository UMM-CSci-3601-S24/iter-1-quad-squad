import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { ActivatedRoute, ParamMap, Router, RouterModule } from '@angular/router';
import { HuntService } from '../hunt/hunt.service';
import { TaskService } from '../hunt/task.service';
import { Hunt } from '../hunt/hunt';
import { Observable, map, switchMap, takeUntil } from 'rxjs';
import { Subject } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Task } from '../hunt/task';
import { MatNavList } from '@angular/material/list';

@Component({
  selector: 'app-host',
  providers: [HttpClient],
  standalone: true,
  imports: [MatCardModule, CommonModule, HttpClientModule, RouterModule, MatNavList],
  templateUrl: './host.component.html',
  styleUrl: './host.component.scss'
})

export class HostComponent implements OnInit, OnDestroy {

  hunts$: Observable<Hunt[]>;
  showCreateForm: boolean = false;
  public taskHunt: Hunt;
  public taskHuntId: string;
  public taskHuntName: string;
  public taskHuntDescription: string;
  errMsg = '';
  private ngUnsubscribe = new Subject<void>();
  public serverFilteredTasks: Task[];

  constructor(private http: HttpClient, private router: Router, private huntService: HuntService, private taskService: TaskService, private snackBar: MatSnackBar, private route: ActivatedRoute) { }

  @Input() task: Task;
  toggleCreateForm(): void {
    this.showCreateForm = !this.showCreateForm;
  }
  navigateToHuntDetails(huntId: string) {
    this.router.navigate(['/tasks', huntId]);
  }

  getTasksFromServer(): void {
    this.taskService.getTasks(this.taskHuntId)
      .pipe(
        takeUntil(this.ngUnsubscribe)
      ).subscribe({
        next: (returnedTasks) => {
          this.serverFilteredTasks = returnedTasks;
        }
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
        //     { duration: 6000 });
        // },
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

  ngOnInit(): void {
    this.getHuntFromServer();
  }


  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }
}

