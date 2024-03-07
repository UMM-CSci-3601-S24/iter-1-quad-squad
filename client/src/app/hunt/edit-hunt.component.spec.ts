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
import { Hunt } from './hunt';
import { Task } from './task';
import { TaskElementComponent } from './task-element.component';
import { EditHuntComponent } from './edit-hunt.component';
import { TaskService } from './task.service';
import { HuntService } from './hunt.service';
import { ActivatedRouteStub } from 'src/testing/activated-route-stub';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { ActivatedRoute } from '@angular/router';

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

describe('edit hunt', () => {
  let editHunt: EditHuntComponent;
  let fixture: ComponentFixture<EditHuntComponent>
  const neededHuntId: string = 'first_hunt_id';
  const activatedRoute: ActivatedRouteStub = new ActivatedRouteStub({
    // Using the constructor here lets us try that branch in `activated-route-stub.ts`
    // and then we can choose a new parameter map in the tests if we choose
    huntId: neededHuntId
  });



  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [COMMON_IMPORTS, EditHuntComponent, TaskElementComponent],
      providers: [
        { provide: TaskService, useValue: new MockTaskService() },
        { provide: HuntService, useValue: new MockHuntService() },
        { provide: ActivatedRoute, useValue: activatedRoute }
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    // Compile all the components in the test bed
    // so that everything's ready to go.

      fixture = TestBed.createComponent(EditHuntComponent);
      editHunt = fixture.componentInstance;

      fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(editHunt).toBeTruthy();
  });

  it('mocks the right huntId', () => {
    const expectedHunt: Hunt = MockHuntService.testHunts[0];
    activatedRoute.setParamMap({ huntId: expectedHunt._id });
    expect(editHunt.taskHuntId).toEqual('first_hunt_id');
  })
  it('contains all the tasks', () => {
    expect(editHunt.serverFilteredTasks.length).toBe(3);
  });

  it('contains a task with id Id_number_2', () => {
    expect(editHunt.serverFilteredTasks.some((task: Task) => task._id === 'Id_number_2')).toBe(true)
  });


})

describe('generates an error if we don\'t set up a TaskListService', () => {
  let editHunt: EditHuntComponent;
  let fixture: ComponentFixture<EditHuntComponent>
  const activatedRoute: ActivatedRouteStub = new ActivatedRouteStub({
    // Using the constructor here lets us try that branch in `activated-route-stub.ts`
    // and then we can choose a new parameter map in the tests if we choose
    huntid: 'first_hunt_id'
  });

  let taskServiceStub: {
    getTasks: () => Observable<Task[]>;
  };

  beforeEach(() => {
    taskServiceStub = {
      getTasks: () => new Observable(observer => {
        observer.error('getUsers() Observer generates an error');
      }),
    };
    TestBed.configureTestingModule({
      imports: [COMMON_IMPORTS, EditHuntComponent, TaskElementComponent],
      providers: [{ provide: TaskService, useValue: taskServiceStub },
      { provide: HuntService, useValue: new MockHuntService() }, { provide: ActivatedRoute, useValue: activatedRoute }]
    })
  });

  beforeEach(waitForAsync(() => {
    // Compile all the components in the test bed
    // so that everything's ready to go.
    TestBed.compileComponents().then(() => {

      fixture = TestBed.createComponent(EditHuntComponent);
      editHunt = fixture.componentInstance;

      fixture.detectChanges();
    });
  }));

  it('generates an error if we don\'t set up a UserListService', () => {

    expect(editHunt.serverFilteredTasks)
      .withContext('service can\'t give values to the list if it\'s not there')
      .toBeUndefined();

    expect(editHunt.errMsg)
      .withContext('the error message will be')
      .toContain('Problem contacting the server – Error Code:');
  })
})
