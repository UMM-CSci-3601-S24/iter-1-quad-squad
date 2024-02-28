import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Task } from './task'
import { map } from 'rxjs/operators';


@Injectable({
  providedIn: `root`
})
export class TaskService{
  readonly taskUrl: string = `${environment.apiUrl}`;
  readonly huntIdKey: string = 'huntId';


constructor(private httpClient: HttpClient) {
}

// getTasks(huntId?: string): Observable<Task[]>{
//   let httpParams: HttpParams = new HttpParams();
//   if (huntId) {
//   httpParams = httpParams.set(this.huntIdKey, huntId);
//   }
//   return this.httpClient.get<Task[]>(this.taskUrl, {params: httpParams,
//   });
// }

getTasks(huntId: string): Observable<Task[]>{
  return this.httpClient.get<Task[]>(this.taskUrl + 'huntId/' + huntId)

}

addTask(newTask: Partial<Task>): Observable<string> {
  return this.httpClient.post<{id: string}>(this.taskUrl, newTask).pipe(map(res => res.id));
}
}
