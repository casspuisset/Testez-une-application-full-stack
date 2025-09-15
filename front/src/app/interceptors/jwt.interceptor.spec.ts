import { TestBed } from '@angular/core/testing';
import { jest, expect } from '@jest/globals';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { HTTP_INTERCEPTORS, HttpClient } from '@angular/common/http';
import { JwtInterceptor } from './jwt.interceptor';
import { SessionService } from '../services/session.service';

describe('JwtInterceptor', () => {
  let httpMock: HttpTestingController;

  let httpClient: HttpClient;

  let mockSessionService: {
    sessionInformation: {
      token: string | undefined;
      admin: boolean;
      username: string;
    };
    isLogged: boolean;
  } = {
    sessionInformation: { token: undefined, admin: true, username: 'user' },
    isLogged: false,
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
        { provide: SessionService, useValue: mockSessionService },
      ],
    });

    httpClient = TestBed.inject(HttpClient);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should not add an Authorization header if the user is not logged in', () => {
    mockSessionService.isLogged = false;
    httpClient.get('/api/test').subscribe();
    const httpRequest = httpMock.expectOne('/api/test');

    expect(httpRequest.request.headers.has('Authorization')).toBeFalsy();
  });

  it('should add a token on Authorization header when the user is logged in', () => {
    mockSessionService.isLogged = true;
    const testToken = 'token';
    mockSessionService.sessionInformation = {
      token: 'token',
      username: 'user',
      admin: true,
    };
    httpClient.get('/api/test').subscribe();
    const httpRequest = httpMock.expectOne('/api/test');

    expect(httpRequest.request.headers.has('Authorization')).toBeTruthy();
    expect(httpRequest.request.headers.get('Authorization')).toBe(
      `Bearer ${testToken}`
    );
  });
});
