import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { AppComponent } from 'src/app/app.component';
import { Task } from 'src/app/hunt/task';
import { TaskService } from 'src/app/hunt/task.service';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: AppComponent
})

export class MockTaskService extends TaskService {
  static testTasks: Task[] = [
    {
      _id: 'Id_num_1',
      description: 'description for 1 lol',
      huntId: 'first_hunt_id',
      position: 1
    },
    {
      _id: 'Id_number_2',
      description: 'next describer floof',
      huntId: 'first_hunt_id',
      position: 2
    },
    {
      _id: 'Idinthe3',
      description: 'descriptions are loooooong',
      huntId: 'first_hunt_id',
      position: 1
    }
  ];

  constructor() {
    super(null);
  }

  getTasks(huntId: string): Observable<Task[]> {
    return of(MockTaskService.testTasks).pipe(
      map(tasks => tasks.filter(task => task.huntId === huntId))
    );
  }

  // getTaskById(id: string): Observable<Task> {
  //   if (id === MockTaskService.testTasks[0]._id) {
  //     return of(MockTaskService.testTasks[0]);
  //   } else if (id === MockTaskService.testTasks[1]._id) {
  //     return of(MockTaskService.testTasks[1]);
  //   } else if (id === MockTaskService.testTasks[2]._id) {
  //     return of(MockTaskService.testTasks[2]);
  //   } else {
  //     return of(null);
  //   }
  // }
}
