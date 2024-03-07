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
import { MockHuntService } from 'src/testing/hunt.service.mock';
import { CreateHuntComponent } from './create-hunt.component';
import { HuntService } from '../hunt/hunt.service';
import { HostComponent } from '../host/host.component';

describe('CreateHuntComponent', () => {
  let createHuntComponent: CreateHuntComponent;
  let createHuntForm: FormGroup;
  let fixture: ComponentFixture<CreateHuntComponent>

  beforeEach(waitForAsync(() => {
    TestBed.overrideProvider(HuntService, { useValue: new MockHuntService() });
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
        CreateHuntComponent
    ],
}).compileComponents().catch(error => {
      expect(error).toBeNull();
    });
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateHuntComponent);
    createHuntComponent = fixture.componentInstance;
    fixture.detectChanges();
    createHuntForm = createHuntComponent.addHuntForm;
    expect(createHuntForm).toBeDefined();
    expect(createHuntForm.controls).toBeDefined();
  });

  it('should create the component and form', () => {
    expect(createHuntComponent).toBeTruthy();
    expect(createHuntForm).toBeTruthy();
  });

  it('form should be invalid when empty', () => {
    expect(createHuntForm.valid).toBeTruthy;
  });

  describe('getErrorMessage() for Task creation', () => {
    it('should return the correct error message', () => {
      const controlName: keyof typeof createHuntComponent.addHuntValidationMessages = 'description';
      createHuntComponent.addHuntForm.get(controlName).setErrors({'required': true});
      expect(createHuntComponent.getErrorMessage(controlName)).toEqual('Description is required');
    });

    it('should return "Unknown error" if no error message is found', () => {
      const controlName: keyof typeof createHuntComponent.addHuntValidationMessages = 'description';
      createHuntComponent.addHuntForm.get(controlName).setErrors({'unknown': true});
      expect(createHuntComponent.getErrorMessage(controlName)).toEqual('Unknown error');
    });
  });
});

