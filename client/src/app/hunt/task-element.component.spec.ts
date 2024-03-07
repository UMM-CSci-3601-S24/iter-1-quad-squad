import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { TaskElementComponent } from './task-element.component'
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatCardModule } from '@angular/material/card';



describe('TaskElementComponent', () => {
  let component: TaskElementComponent;
  let fixture: ComponentFixture<TaskElementComponent>

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        BrowserAnimationsModule,
        MatCardModule,
        TaskElementComponent
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TaskElementComponent);
    component = fixture.componentInstance;
    component.task = {
      _id: 'testID',
      description: 'testing description',
      huntId: 'huntIDTester',
      position: 0
    };
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

})
