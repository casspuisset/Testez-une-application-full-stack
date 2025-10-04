import { TestBed } from '@angular/core/testing';
import { AuthService } from './auth.service';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { HttpTestingController } from '@angular/common/http/testing';
import { expect } from '@jest/globals';
import { LoginRequest } from '../interfaces/loginRequest.interface';
import { RegisterRequest } from '../interfaces/registerRequest.interface';
import { SessionInformation } from 'src/app/interfaces/sessionInformation.interface';

describe('authService', () => {
  let service: AuthService;
  let controller: HttpTestingController;

  let mockLoginRequest: LoginRequest = {
    email: 'yoga@studio.com',
    password: 'test!1234',
  };

  let mockRegisterRequest: RegisterRequest = {
    email: 'test@test.com',
    firstName: 'Test',
    lastName: 'TEST',
    password: 'password',
  };

  let mockSessionInfo: SessionInformation = {
    id: 1,
    admin: true,
    token: 'token',
    type: 'user',
    username: 'user',
    firstName: 'Test',
    lastName: 'TEST',
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientModule],
      providers: [AuthService, HttpTestingController, HttpClientModule],
    });
    service = TestBed.inject(AuthService);
    controller = TestBed.inject(HttpTestingController);
  });

  it('should create', () => {
    expect(service).toBeTruthy();
  });

  it('should log in', () => {
    service.login(mockLoginRequest).subscribe((response) => {
      expect(response).toEqual(mockSessionInfo);
    });
  });

  it('should register', () => {
    service.register(mockRegisterRequest).subscribe((data) => {
      expect(data).toBeUndefined();
    });
  });
});
