import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
// import { Task } from './task'
import { Hunt } from './hunt';
// import { map } from 'rxjs/operators';

@Injectable({
  providedIn: `root`
})

export class HuntService{
  readonly huntUrl: string = `${environment.apiUrl}hunt`;

  constructor(private httpClient: HttpClient) {
  }

getHuntById(id: string): Observable<Hunt> {
  return this.httpClient.get<Hunt>(`${this.huntUrl}/${id}`);
}

}
