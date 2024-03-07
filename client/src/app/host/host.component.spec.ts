import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatOptionModule } from '@angular/material/core';
import { MatDividerModule } from '@angular/material/divider';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatTooltipModule } from '@angular/material/tooltip';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { Observable } from 'rxjs';
import { MockTaskService } from 'src/testing/task.service.mock';
import { MockHuntService } from 'src/testing/hunt.service.mock';
import { Hunt } from '../hunt/hunt';
import { TaskService } from '../hunt/task.service';
import { HuntService } from '../hunt/hunt.service';
import { ActivatedRouteStub } from 'src/testing/activated-route-stub';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { ActivatedRoute } from '@angular/router';
import { HostComponent } from './host.component';


const COMMON_IMPORTS: unknown[] = [
 FormsModule,
 MatCardModule,
 MatFormFieldModule,
 MatSelectModule,
 MatOptionModule,
 MatButtonModule,
 MatInputModule,
 MatExpansionModule,
 MatTooltipModule,
 MatListModule,
 MatDividerModule,
 MatRadioModule,
 MatIconModule,
 MatSnackBarModule,
 BrowserAnimationsModule,
 RouterTestingModule,
];


describe('HostComponent', () => {
 let hostComponent: HostComponent;
 let fixture: ComponentFixture<HostComponent>;


 beforeEach(waitForAsync( () => {
   TestBed.configureTestingModule({
     imports: [COMMON_IMPORTS, HostComponent],
     providers: [{ provide: TaskService, useValue: new MockTaskService() },
       {provide: HuntService, useValue: new MockHuntService()}]


   })
   .compileComponents();
 }));


 beforeEach(() => {
   fixture = TestBed.createComponent(HostComponent);
   hostComponent = fixture.componentInstance;
   fixture.detectChanges();
 });


 it('contains all the hunts', () => {
   expect(hostComponent.serverFilteredHunts.length).toBe(3);
 });

it('can search for all hunts with Id', () => {
  const id1 = hostComponent.serverFilteredHunts[0]._id
  hostComponent.seeHuntDetails(id1)
  expect(hostComponent.huntChosen).toBe(hostComponent.serverFilteredHunts[0])

  const id2 = hostComponent.serverFilteredHunts[1]._id
  hostComponent.seeHuntDetails(id2)
  expect(hostComponent.huntChosen).toBe(hostComponent.serverFilteredHunts[1])

  const id3 = hostComponent.serverFilteredHunts[2]._id
  hostComponent.seeHuntDetails(id3)
  expect(hostComponent.huntChosen).toBe(hostComponent.serverFilteredHunts[2])
})




});


