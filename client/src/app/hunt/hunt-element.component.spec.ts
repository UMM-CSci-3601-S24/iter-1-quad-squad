import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { HuntElementComponent } from './hunt-element.component'
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatCardModule } from '@angular/material/card';

describe('HuntElementComponent', () => {
  let component: HuntElementComponent;
  let fixture: ComponentFixture<HuntElementComponent>

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        BrowserAnimationsModule,
        MatCardModule,
        HuntElementComponent
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HuntElementComponent);
    component = fixture.componentInstance;
    component.hunt = {
      _id: 'huntID',
      name: 'testing name',
      ownerId: 'TestOwnerID',
      description: 'test description'
    };
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

})
