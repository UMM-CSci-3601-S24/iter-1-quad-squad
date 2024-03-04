import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { environment } from '../../environments/environment';
import { Hunt } from './hunt';
// import { map } from 'rxjs/operators';

@Injectable({
  providedIn: `root`
})

export class HuntService{
  readonly huntUrl: string = `${environment.apiUrl}hunt`;

  constructor(private httpClient: HttpClient) { }

getHuntById(id: string): Observable<Hunt> {
  return this.httpClient.get<Hunt>(`${this.huntUrl}/${id}`);
}

getHunts(): Observable<Hunt[]> {
  return this.httpClient.get<Hunt[]>(this.huntUrl + "s");
}

addHunt(newHunt: Partial<Task>): Observable<string> {
  return this.httpClient.post<{id: string}>(this.huntUrl + 'hunt/new/', newHunt).pipe(map(res => res.id));
}

}
