import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddHuntComponent } from './add-hunt.component';

describe('AddHuntComponent', () => {
  let component: AddHuntComponent;
  let fixture: ComponentFixture<AddHuntComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddHuntComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AddHuntComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
