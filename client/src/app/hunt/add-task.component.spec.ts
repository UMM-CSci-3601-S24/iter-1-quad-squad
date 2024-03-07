import { Location } from '@angular/common';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ComponentFixture, TestBed, fakeAsync, flush, tick, waitForAsync } from '@angular/core/testing';
import { FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';
import { MockTaskService } from 'src/testing/task.service.mock';
import { AddTaskComponent } from './add-task.component';
import { TaskService } from './task.service';
import { EditHuntComponent } from './edit-hunt.component';

describe('AddTaskComponet', () => {
  let addTaskComponent: AddTaskComponent;
  let addTaskForm: FormGroup;
  let fixture: ComponentFixture<AddTaskComponent>

  beforeEach(waitForAsync(() => {
    TestBed.overrideProvider(TaskService, { useValue: new MockTaskService() });
    TestBed.configureTestingModule({
    imports: [
        FormsModule,
        ReactiveFormsModule,
        MatSnackBarModule,
        MatCardModule,
        MatFormFieldModule,
        MatSelectModule,
        MatInputModule,
        BrowserAnimationsModule,
        RouterTestingModule,
        AddTaskComponent
    ],
}).compileComponents().catch(error => {
      expect(error).toBeNull();
    });
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddTaskComponent);
    addTaskComponent = fixture.componentInstance;
    fixture.detectChanges();
    addTaskForm = addTaskComponent.addTaskForm;
    expect(addTaskForm).toBeDefined();
    expect(addTaskForm.controls).toBeDefined();
  });

  it('should create the component and form', () => {
    expect(addTaskComponent).toBeTruthy();
    expect(addTaskForm).toBeTruthy();
  });

  it('form should be invalid when empty', () => {
    expect(addTaskForm.valid).toBeFalsy();
  });


  describe('getErrorMessage() for Task creation', () => {
    it('should return the correct error message', () => {
      const controlName: keyof typeof addTaskComponent.addTaskValidationMessages = 'description';
      addTaskComponent.addTaskForm.get(controlName).setErrors({'required': true});
      expect(addTaskComponent.getErrorMessage(controlName)).toEqual('Description is required');
    });

    it('should return "Unknown error" if no error message is found', () => {
      const controlName: keyof typeof addTaskComponent.addTaskValidationMessages = 'description';
      addTaskComponent.addTaskForm.get(controlName).setErrors({'unknown': true});
      expect(addTaskComponent.getErrorMessage(controlName)).toEqual('Unknown error');
    });
  });
});

describe('AddTaskComponent submitform function', () => {
  let addTaskComponent: AddTaskComponent;
  let fixture: ComponentFixture<AddTaskComponent>
  let taskService: TaskService;
  let location: Location;

  beforeEach(() => {
    TestBed.overrideProvider(TaskService, { useValue: new MockTaskService() });
    TestBed.configureTestingModule({
    imports: [
        ReactiveFormsModule,
        MatSnackBarModule,
        MatCardModule,
        MatSelectModule,
        MatInputModule,
        BrowserAnimationsModule,
        RouterTestingModule.withRoutes([
            { path: 'tasks/testHuntId', component: EditHuntComponent }
        ]),
        HttpClientTestingModule,
        AddTaskComponent, EditHuntComponent
    ],
}).compileComponents().catch(error => {
      expect(error).toBeNull();
    });
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddTaskComponent);
    addTaskComponent = fixture.componentInstance;
    taskService = TestBed.inject(TaskService);
    location = TestBed.inject(Location);
    // We need to inject the router and the HttpTestingController, but
    // never need to use them. So, we can just inject them into the TestBed
    // and ignore the returned values.
    TestBed.inject(Router);
    TestBed.inject(HttpTestingController);
    fixture.detectChanges();
  });

  beforeEach(() => {
    addTaskComponent.addTaskForm.controls.description.setValue('test description');
    addTaskComponent.addTaskForm.controls.huntId.setValue('test huntId');
    addTaskComponent.addTaskForm.controls.position.setValue(0);
  })

  it('should call addTask() and handle success response', fakeAsync(() => {
    fixture.ngZone.run(() => {
      addTaskComponent.usedHuntId = 'testHuntId';
      tick();

      const addTaskSpy = spyOn(taskService, 'addTask')
      .withArgs(addTaskComponent.addTaskForm.value, addTaskComponent.usedHuntId)
      .and.returnValue(of('1'));
      addTaskComponent.submitForm();


      expect(addTaskSpy).toHaveBeenCalledWith(addTaskComponent.addTaskForm.value, 'testHuntId');
      tick();
      expect(location.path()).toBe('/tasks/testHuntId')

      flush();
    });
  }));

});
