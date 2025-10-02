import { HttpClientModule } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatToolbarModule } from '@angular/material/toolbar';
import { RouterTestingModule } from '@angular/router/testing';
import { expect, jest } from '@jest/globals';
import { AppComponent } from './app.component';
import { BehaviorSubject, of } from 'rxjs';
import { Router } from '@angular/router';
import { SessionService } from './services/session.service';

describe('AppComponent', () => {
  let router: Router;
  let mockSessionService: any = { $isLogged: jest.fn(), logOut: jest.fn() };
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;

  //before each test
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RouterTestingModule, HttpClientModule, MatToolbarModule],
      declarations: [AppComponent],
      providers: [{ provide: SessionService, useValue: mockSessionService }],
    }).compileComponents();
    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    jest
      .spyOn(router, 'navigate')
      .mockImplementation(() => Promise.resolve(true));
    fixture.detectChanges();
  });

  //tests
  it('should create the app', () => {
    expect(component).toBeTruthy();
  });

  it('Should log out when the user want to disconnect', () => {
    let logged!: Boolean;
    let loggedBS = new BehaviorSubject<Boolean>(logged);

    component.logout();

    mockSessionService.logOut.mockImplementation({
      sessionInformation: undefined,
      logged: false,
      loggedBS: loggedBS.next(logged),
    });

    expect(mockSessionService.logOut).toHaveBeenCalled;
    expect(router.navigate).toHaveBeenCalledWith(['']);
  });

  it('should display the logged nav bar when logged', () => {
    mockSessionService.$isLogged.mockReturnValue(of(true));
    fixture.detectChanges();
    let integrated = fixture.nativeElement;
    expect(integrated.querySelector('[routerLink="sessions"]')).toBeTruthy();
    expect(
      integrated.querySelector('[routerLink="sessions"]').textContent
    ).toContain('Sessions');
    expect(integrated.querySelector('[routerLink="me"]')).toBeTruthy();
    expect(integrated.querySelector('[routerLink="me"]').textContent).toContain(
      'Account'
    );
  }); ///i

  it('should display the not logged nav bar when not logged', () => {
    mockSessionService.$isLogged.mockReturnValue(of(false));
    fixture.detectChanges();
    let integrated = fixture.nativeElement;

    expect(integrated.querySelector('[routerLink="login"]')).toBeTruthy();
    expect(
      integrated.querySelector('[routerLink="login"]').textContent
    ).toContain('Login');
    expect(integrated.querySelector('[routerLink="register"]')).toBeTruthy();
    expect(
      integrated.querySelector('[routerLink="register"]').textContent
    ).toContain('Register');
  }); ///i
});
