import { TestBed } from '@angular/core/testing';
import { SessionService } from './session.service';
import { jest, expect } from '@jest/globals';
import { SessionInformation } from '../interfaces/sessionInformation.interface';
import { HttpClientModule } from '@angular/common/http';
import { HttpTestingController } from '@angular/common/http/testing';

describe('SessionService', () => {
  let mockService: SessionService;
  let controller: HttpTestingController;
  const mockUser: SessionInformation = {
    id: 1,
    type: 'type',
    firstName: 'firstname',
    lastName: 'lastname',
    admin: true,
    username: 'testUser',
    token: 'fake-jwt-token',
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientModule],
      providers: [SessionService, HttpTestingController],
    });
    mockService = TestBed.inject(SessionService);
    controller = TestBed.inject(HttpTestingController);
  });

  // afterEach(() => {
  //   controller.verify();
  // });

  it('should be created', () => {
    expect(mockService).toBeTruthy();
  });

  it('should initialize with isLogged as false', () => {
    expect(mockService.isLogged).toBeFalsy();
    expect(mockService.sessionInformation).toBeUndefined();
  });

  it('should return isLogged observable with initial value false', (done) => {
    mockService.$isLogged().subscribe((isLogged) => {
      expect(isLogged).toBeFalsy();
      done();
    });
  });

  describe('logIn', () => {
    it('should set isLogged to true and update sessionInformation', () => {
      jest.spyOn(mockService['isLoggedSubject'], 'next');
      mockService.logIn(mockUser);

      expect(mockService.isLogged).toBeTruthy();
      expect(mockService.sessionInformation).toEqual(mockUser);
      expect(mockService['isLoggedSubject'].next).toHaveBeenCalledWith(true);
    });

    it('should emit true on $isLogged observable after login', (done) => {
      mockService.logIn(mockUser);
      mockService.$isLogged().subscribe((isLogged) => {
        expect(isLogged).toBeTruthy();
        done();
      });
    });
  });

  describe('logOut', () => {
    beforeEach(() => {
      mockService.logIn(mockUser);
    });

    it('should set isLogged to false and clear sessionInformation', () => {
      jest.spyOn(mockService['isLoggedSubject'], 'next');
      mockService.logOut();

      expect(mockService.isLogged).toBeFalsy();
      expect(mockService.sessionInformation).toBeUndefined();
      expect(mockService['isLoggedSubject'].next).toHaveBeenCalledWith(false);
    });

    it('should emit false on $isLogged observable after logout', (done) => {
      mockService.logOut();
      mockService.$isLogged().subscribe((isLogged) => {
        expect(isLogged).toBeFalsy();
        done();
      });
    });
  });

  describe('next', () => {
    it('should call next on isLoggedSubject with current isLogged value', () => {
      jest.spyOn(mockService['isLoggedSubject'], 'next');
      mockService.logIn(mockUser);

      expect(mockService['isLoggedSubject'].next).toHaveBeenCalledWith(true);
    });
  });
});
