import { TestBed } from '@angular/core/testing';
import { AuthService } from './auth.service';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { HttpTestingController } from '@angular/common/http/testing';
import { expect } from '@jest/globals';
import { LoginRequest } from '../interfaces/loginRequest.interface';

describe('authService', () => {
  let service: AuthService;
  let controller: HttpTestingController;
  let mockRequest: LoginRequest = {
    email: 'yoga@studio.com',
    password: 'test!1234',
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

  it('should log', () => {
    service.login(mockRequest).subscribe((data) => {
      expect(data.token).toBeDefined();
    });
  });
});
