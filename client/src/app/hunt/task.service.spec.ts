import { HttpClient } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed, waitForAsync } from '@angular/core/testing';
import { of } from 'rxjs';
import { Task } from './task';
import { TaskService } from './task.service';

describe('TaskService', () => {

  const testTasks: Task[] = [
    {
      _id: 'Id_num_1',
      description: 'description for 1 lol',
      huntId: 'first_hunt_id',
      position: 1
    },
    {
      _id: 'Id_number_2',
      description: 'next describer floof',
      huntId: 'first_hunt_id',
      position: 2
    },
    {
      _id: 'Idinthe3',
      description: 'descriptions are loooooong',
      huntId: 'first_hunt_id',
      position: 1
    }
  ]

  let taskService: TaskService;
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
    taskService = new TaskService(httpClient);
  });

  afterEach(() => {
    // After every test, assert that there are no more pending requests.
    httpTestingController.verify();
  });

  describe('when getTasks() is called with first hunt id', () => {
    it('calls api/tasks/first_hunt_id', waitForAsync(() => {
      const mockedMethod = spyOn(httpClient, 'get').and.returnValue(of(testTasks));

      taskService.getTasks('first_hunt_id').subscribe((tasks) => {
        expect(tasks)
        .withContext('contains test tasks')
        .toBe(testTasks);

        expect(mockedMethod)
        .withContext('one call')
        .toHaveBeenCalledTimes(1);

        expect(mockedMethod)
        .withContext('talks to the correct endpoint')
        .toHaveBeenCalledWith(taskService.taskUrl + 'tasks/first_hunt_id');
      });
    }));

    describe('adding a task using addTasks()', () => {
      it('talks to the right endpoint and is called once', waitForAsync(() => {
        const task_id = 'Id_num_1';
        const expected_http_response = { id: task_id};

        const mockedMethod = spyOn(httpClient, 'post')
        .and
        .returnValue(of(expected_http_response));

        taskService.addTask(testTasks[1], 'first_hunt_id').subscribe((new_task_id) => {
          expect(new_task_id).toBe(task_id);

          expect(mockedMethod)
          .withContext('one call')
          .toHaveBeenCalledTimes(1);

          expect(mockedMethod)
          .withContext('talks to the correct endpoint')
          .toHaveBeenCalledWith(taskService.taskUrl + 'task/new/first_hunt_id', testTasks[1])
        })
      }))
    })
  })














})
