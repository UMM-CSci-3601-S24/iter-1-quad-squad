import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HuntDetailsComponent } from './hunt-details.component';

describe('HuntDetailsComponent', () => {
  let component: HuntDetailsComponent;
  let fixture: ComponentFixture<HuntDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HuntDetailsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(HuntDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
