import { DebugElement } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatCardModule } from '@angular/material/card';
import { By } from '@angular/platform-browser';
import { HomeComponent } from './home.component';

describe('HomeComponent', () => {

  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;
  let de: DebugElement;
  let el: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MatCardModule],
      declarations: [HomeComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
    de = fixture.debugElement;
    el = de.nativeElement;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should contain the basic home page text', () => {
    fixture.detectChanges();
    expect(el.textContent).toContain('This is a home page! It doesn\'t do anything!');
  });

  it('should contain a login button', () => {
    fixture.detectChanges();
    const loginButton = de.query(By.css('.login-button'));
    expect(loginButton).toBeTruthy();
    expect(loginButton.nativeElement.textContent).toContain('Login');
  });

  it('login button should trigger login method when clicked', () => {
    spyOn(component, 'login'); // Spy on the login method
    fixture.detectChanges();
    const loginButton = de.query(By.css('.login-button'));
    loginButton.triggerEventHandler('click', 'dummy payload');
    expect(component.login).toHaveBeenCalled();
  });

});
