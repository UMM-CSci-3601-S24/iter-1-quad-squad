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
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBarModule } from '@angular/material/snack-bar';

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

  beforeEach(() => {
    TestBed.configureTestingModule({
    imports: [COMMON_IMPORTS, EditHuntComponent, TaskElementComponent],
    providers: [{ provide: TaskService, useValue: new MockTaskService() }, {provide: HuntService, useValue: new MockHuntService()}]
});
});

beforeEach(waitForAsync(() => {
  // Compile all the components in the test bed
  // so that everything's ready to go.
    TestBed.compileComponents().then(() => {
      /* Create a fixture of the UserListComponent. That
       * allows us to get an instance of the component
       * (userList, below) that we can control in
       * the tests.
       */
      fixture = TestBed.createComponent(EditHuntComponent);
      editHunt = fixture.componentInstance;
      /* Tells Angular to sync the data bindings between
       * the model and the DOM. This ensures, e.g., that the
       * `userList` component actually requests the list
       * of users from the `MockUserService` so that it's
       * up to date before we start running tests on it.
       */
      fixture.detectChanges();
    });
  }));

  // it('contains all the tasks', () => {
  //   expect(editHunt.serverFilteredTasks.length).toBe(3);
  // });

  // it('contains a task with id Id_number_2', () => {
  //   expect(editHunt.serverFilteredTasks.some((task: Task) => task._id === 'Id_number_2')).toBe(true)
  // });


})
