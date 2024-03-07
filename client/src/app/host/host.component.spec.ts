import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HostComponent } from './host.component';
import { MockHuntService } from 'src/testing/hunt.service.mock';
import { Hunt } from '../hunt/hunt';

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

describe('MockHuntService', () => {
  let service: MockHuntService;

  beforeEach(() => {
    service = new MockHuntService();
  });

  it('should return the correct hunt when the id matches', () => {
    const id = MockHuntService.testHunts[0]._id;
    const id2 = MockHuntService.testHunts[1]._id;
    const id3 = MockHuntService.testHunts[2]._id;

    const expectedHunt = MockHuntService.testHunts[0];
    const expectedHunt2 = MockHuntService.testHunts[1]; // Assign a value to expectedHunt2

    service.getHuntById(id).subscribe((hunt: Hunt) => {
      expect(hunt).toEqual(expectedHunt);
    });

    service.getHuntById(id2).subscribe((hunt: Hunt) => { // Use expectedHunt2 in an assertion statement
      expect(hunt).toEqual(expectedHunt2);
    });

    service.getHuntById(id3).subscribe((hunt: Hunt) => {
      expect(hunt).toEqual(MockHuntService.testHunts[2]);
    });

  });

  it('should return the default hunt when the id does not match', () => {
    const id = 'invalid-id';
    const expectedHunt = MockHuntService.testHunts[0];

    service.getHuntById(id).subscribe((hunt: Hunt) => {
      expect(hunt).toEqual(expectedHunt);
    });
  });
});
