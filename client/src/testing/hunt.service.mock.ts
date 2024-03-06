import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { AppComponent } from 'src/app/app.component';
import { Hunt } from 'src/app/hunt/hunt';
import { HuntService } from 'src/app/hunt/hunt.service';

@Injectable({
  providedIn: AppComponent
})

export class MockHuntService extends HuntService {
  static testHunts: Hunt[] = [
    {
      _id: 'first_hunt_id',
      name: 'para hunt',
      description: 'description for 1 lol',
      ownerId: 'blank'
    },
    {
      _id: 'Id_number_2',
      name: 'urag hunt',
      description: 'next describer floof',
      ownerId: 'blank'
    },
    {
      _id: 'Idinthe3',
      name: 'numb 3 hunt',
      description: 'descriptions are loooooong',
      ownerId: 'imagine owner'
    }
  ]

  constructor() {
    super(null);
  }

  getHunts(): Observable<Hunt[]> {
    return of(MockHuntService.testHunts);
  }

  getHuntById(id: string): Observable<Hunt> {
    if (id === MockHuntService.testHunts[0]._id) {
      return of(MockHuntService.testHunts[0]);
    } else if (id === MockHuntService.testHunts[1]._id) {
      return of(MockHuntService.testHunts[1]);
    } else if (id === MockHuntService.testHunts[2]._id) {
      return of(MockHuntService.testHunts[2]);
    } else {
      return of(MockHuntService.testHunts[0]);
    }
//     const foundHunt = MockHuntService.testHunts.find(hunt => hunt._id === id);
//   if (foundHunt) {
//     return of(foundHunt);
//   } else {
//     // Handle the case where the hunt with the provided id is not found
//     // For example, return null or throw an error
//     return of(null);
//   }
// }
}
}
