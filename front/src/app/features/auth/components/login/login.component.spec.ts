import { HttpClientModule } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { expect } from '@jest/globals';
import { SessionService } from 'src/app/services/session.service';

import { LoginComponent } from './login.component';
import { LoginRequest } from '../../interfaces/loginRequest.interface';
import { of, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let mockAuthService: any = {
    login: jest.fn().mockReturnValue({ subscribe: jest.fn() }),
  };
  let mockFormBuilder: FormBuilder = new FormBuilder();
  let mockSessionService: any = { logIn: jest.fn() };
  let mockRouter: any = { navigate: jest.fn() };
  let mockComponent: LoginComponent = new LoginComponent(
    mockAuthService as AuthService,
    mockFormBuilder,
    mockRouter as Router,
    mockSessionService as SessionService
  );

  //before each test
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LoginComponent],
      providers: [SessionService],
      imports: [
        RouterTestingModule,
        BrowserAnimationsModule,
        HttpClientModule,
        MatCardModule,
        MatIconModule,
        MatFormFieldModule,
        MatInputModule,
        ReactiveFormsModule,
      ],
    }).compileComponents();
    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  //tests
  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('Should log successfully if email and password match', () => {
    let mockRequest: LoginRequest = {
      email: 'yoga@studio.com',
      password: 'test!12345',
    };

    let mockResponse = {
      token: 'token',
      type: 'Bearer',
      id: 1,
      username: 'username',
      firstName: 'firstName',
      lastName: 'lastName',
      admin: true,
    };

    mockComponent.form.setValue(mockRequest);
    mockAuthService.login.mockReturnValue(of(mockResponse));
    mockComponent.submit();

    expect(mockSessionService.logIn).toHaveBeenCalledWith(mockResponse);
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/sessions']);
  });

  it('Should return an error in case of invalid field', () => {
    const mockEmptyRequest: LoginRequest = {
      email: '',
      password: '',
    };

    mockComponent.form.setValue(mockEmptyRequest);
    mockAuthService.login.mockReturnValue(
      throwError(() => new Error('Error : invalid fields !'))
    );
    mockComponent.submit();

    expect(mockComponent.onError).toBeTruthy();
    expect(mockSessionService.logIn).not.toHaveBeenCalledWith();
    expect(mockRouter.navigate).not.toHaveBeenCalledWith();
  });

  it("Should return an error if user isn't an admin", () => {
    const mockRequest: LoginRequest = {
      email: 'email@email.com',
      password: 'password',
    };

    mockComponent.form.setValue(mockRequest);
    mockAuthService.login.mockReturnValue(
      throwError(() => new Error('Error : invalid credentials !'))
    );
    mockComponent.submit();

    expect(mockComponent.onError).toBeTruthy();
    expect(mockSessionService.logIn).not.toHaveBeenCalledWith();
    expect(mockRouter.navigate).not.toHaveBeenCalledWith();
  });
});
