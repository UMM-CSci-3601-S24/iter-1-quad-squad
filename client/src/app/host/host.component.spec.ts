import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HostComponent } from './host.component';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Hunt } from'../hunt/hunt';

@Injectable({
  providedIn: 'root'
})
export class HuntService {
  private apiUrl = '/api/hosts'; // Adjust the API URL to match your backend setup

  constructor(private http: HttpClient) { }

  getHunts(): Observable<Hunt[]> {
    return this.http.get<Hunt[]>(this.apiUrl);
  }
}

describe('HostComponent', () => {
  let component: HostComponent;
  let fixture: ComponentFixture<HostComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HostComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HostComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });


});
