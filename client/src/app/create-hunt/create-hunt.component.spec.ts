import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Location } from '@angular/common';
import { CreateHuntComponent } from './create-hunt.component';
import { SpyLocation } from '@angular/common/testing';
import { RouterTestingModule } from '@angular/router/testing';

describe('CreateHuntComponent', () => {
  let component: CreateHuntComponent;
  let fixture: ComponentFixture<CreateHuntComponent>;
  let location: SpyLocation;

  const locationStub = {
    back: jasmine.createSpy('back')
}

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateHuntComponent, RouterTestingModule],
      providers: [
        { provide: Location, useValue: locationStub }
      ]
    })
    .compileComponents();
  });


  beforeEach(() => {
    fixture = TestBed.createComponent(CreateHuntComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should go back to previous page on header button click', () => {
    const location = fixture.debugElement.injector.get(Location);
    component.goBack();
    expect(location.back).toHaveBeenCalled();
  });
});
