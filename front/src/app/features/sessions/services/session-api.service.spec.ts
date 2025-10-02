import { HttpClientModule } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { expect } from '@jest/globals';

import { SessionApiService } from './session-api.service';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { Session } from '../interfaces/session.interface';

describe('SessionsService', () => {
  let service: SessionApiService;
  let controller: HttpTestingController;

  const mockSessions: Session[] = [
    {
      id: 1,
      name: 'session',
      description: 'test session',
      date: new Date(),
      teacher_id: 1,
      users: [1],
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ];

  const mockSession: Session = mockSessions[0];

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    service = TestBed.inject(SessionApiService);
    controller = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    controller.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should call all sessions', () => {
    service.all().subscribe((sessions) => {
      expect(sessions).toEqual(mockSessions);
    });

    const request = controller.expectOne('api/session');
    expect(request.request.method).toBe('GET');
    request.flush(mockSessions);
  });

  it('should call a sessions by their id', () => {
    service.detail('1').subscribe((session) => {
      expect(session).toEqual(mockSession);
    });

    const request = controller.expectOne(`api/session/1`);
    expect(request.request.method).toBe('GET');
    request.flush(mockSession);
  });

  it('should delete a session', () => {
    service.delete('1').subscribe((response) => {
      expect(response).toBeTruthy();
    });

    const request = controller.expectOne(`api/session/1`);
    expect(request.request.method).toBe('DELETE');
    request.flush({});
  });

  it('should create a new session', () => {
    const newSession: Session = {
      name: 'session',
      description: 'description',
      date: new Date(),
      teacher_id: 1,
      users: [1],
    };

    service.create(newSession).subscribe((session) => {
      expect(session).toEqual(mockSession);
    });

    const request = controller.expectOne('api/session');
    expect(request.request.method).toBe('POST');
    request.flush(mockSession);
  });

  it('should publish an update session', () => {
    const updatedSession: Session = {
      id: 1,
      name: 'session',
      description: 'test session',
      date: new Date(),
      teacher_id: 1,
      users: [1],
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    service.update('1', updatedSession).subscribe((session) => {
      expect(session).toEqual(mockSession);
    });

    const request = controller.expectOne(`api/session/1`);
    expect(request.request.method).toBe('PUT');
    request.flush(mockSession);
  });

  it('should participate to a session', () => {
    service.participate('1', '1').subscribe((response) => {
      expect(response).toBeTruthy();
    });

    const request = controller.expectOne(`api/session/1/participate/1`);
    expect(request.request.method).toBe('POST');
    request.flush({});
  });

  it('should unparticipate to a session', () => {
    service.unParticipate('1', '1').subscribe((response) => {
      expect(response).toBeTruthy();
    });

    const request = controller.expectOne(`api/session/1/participate/1`);
    expect(request.request.method).toBe('DELETE');
    request.flush({});
  });
});
