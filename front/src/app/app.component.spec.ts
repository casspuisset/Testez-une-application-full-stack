import { HttpClientModule } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { MatToolbarModule } from '@angular/material/toolbar';
import { RouterTestingModule } from '@angular/router/testing';
import { expect, jest } from '@jest/globals';

import { AppComponent } from './app.component';
import { AuthService } from './features/auth/services/auth.service';
import { SessionService } from './services/session.service';
import { SessionInformation } from './interfaces/sessionInformation.interface';
import { BehaviorSubject } from 'rxjs';

describe('AppComponent', () => {
  let mockAuthService: any = jest.fn();
  let mockRouter: any = { navigate: jest.fn() };
  let mockSessionService: any = { logOut: jest.fn() };
  let mockComponent: AppComponent = new AppComponent(
    mockAuthService as AuthService,
    mockRouter,
    mockSessionService as SessionService
  );

  //before each test
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RouterTestingModule, HttpClientModule, MatToolbarModule],
      declarations: [AppComponent],
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  //tests
  it('Should log out when the user want to disconnect', () => {
    let logged!: Boolean;
    let loggedBS = new BehaviorSubject<Boolean>(logged);

    mockComponent.logout();

    mockSessionService.logOut.mockImplementation({
      sessionInformation: undefined,
      logged: false,
      loggedBS: loggedBS.next(logged),
    });

    expect(mockSessionService.logOut).toHaveBeenCalled;
    expect(mockRouter.navigate).toHaveBeenCalledWith(['']);
  });
});
