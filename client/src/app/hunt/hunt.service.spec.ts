import { HttpClient } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed, waitForAsync } from '@angular/core/testing';
import { of } from 'rxjs';
import { Hunt } from './hunt';
import { HuntService } from './hunt.service';

describe('HuntService', () => {
  const testHunts: Hunt[] = [
    {
      _id: 'Id_num_1',
      name: 'para hunt',
      description: 'description for 1 lol',
      ownerId: 'blank'
    },
    {
      _id: 'Id_number_2',
      name: 'urag hunt',
      description: 'next describer floof',
      ownerId: 'blank'
    },
    {
      _id: 'Idinthe3',
      name: 'numb 3 hunt',
      description: 'descriptions are loooooong',
      ownerId: 'imagine owner'
    }
  ]

  let huntService: HuntService;
  let httpClient: HttpClient;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    // Set up the mock handling of the HTTP requests
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule]
    });
    // Construct an instance of the service with the mock
    // HTTP client.
    httpClient = TestBed.inject(HttpClient);
    httpTestingController = TestBed.inject(HttpTestingController);
    huntService = new HuntService(httpClient);
  });

  afterEach(() => {
    // After every test, assert that there are no more pending requests.
    httpTestingController.verify();
  });

describe('when getHunts() is called', () => {
  it('calls api/hunts', waitForAsync(() => {
    const mockedMethod = spyOn(httpClient, 'get').and.returnValue(of(testHunts));

    huntService.getHunts().subscribe((hunts) => {
      expect(hunts)
      .withContext('returns the test hunts')
      .toBe(testHunts);

      expect(mockedMethod)
      .withContext('one call')
      .toHaveBeenCalledTimes(1);

      expect(mockedMethod)
      .withContext('talks to the correct endpoint')
      .toHaveBeenCalledWith(huntService.huntUrl + 's');
    });
  }));
});

describe('when getHuntById() is given an ID', () => {
  it('calls api/hunt/id with the correct ID', waitForAsync(() => {
    const targetHunt: Hunt = testHunts[1];
    const targetId: string = targetHunt._id;

    const mockedMethod = spyOn(httpClient, 'get').and.returnValue(of(targetHunt));

    huntService.getHuntById(targetId).subscribe((hunt) => {
      expect(hunt).withContext('returns the target hunt').toBe(targetHunt)

      expect(mockedMethod)
      .withContext('one call')
      .toHaveBeenCalledTimes(1);

    expect(mockedMethod)
      .withContext('talks to the correct endpoint')
      .toHaveBeenCalledWith(`${huntService.huntUrl}/${targetId}`);
    })
  }))
})







})
