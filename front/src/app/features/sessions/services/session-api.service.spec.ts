import { HttpClientModule } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { expect } from '@jest/globals';

import { SessionApiService } from './session-api.service';
import { HttpTestingController } from '@angular/common/http/testing';
import { SessionService } from 'src/app/services/session.service';
import { Session } from '../interfaces/session.interface';

describe('SessionsService', () => {
  let service: SessionApiService;
  let controller: HttpTestingController;
  let mockSession: Session = {
    id: 1,
    name: 'premier test',
    date: new Date(),
    teacher_id: 2,
    description: 'première session créée et éditée',
    users: [2],
    createdAt: new Date(),
    updatedAt: new Date(),
  };
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientModule],
      providers: [SessionService, HttpTestingController, HttpClientModule],
    });
    service = TestBed.inject(SessionApiService);
    controller = TestBed.inject(HttpTestingController);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should call all sessions', () => {
    let mockData = [
      {
        id: 1,
        name: 'premier test',
        date: '2025-09-01T00:00:00.000+00:00',
        teacher_id: 2,
        description: 'première session créée et éditée',
        users: [2],
        createdAt: '2025-09-02T17:32:28',
        updatedAt: '2025-09-02T17:32:40',
      },
    ];
    service.all().subscribe((data) => {
      expect(data).toEqual(mockData);
    });
  });

  it('should call a sessions by their id', () => {
    service.detail('1').subscribe((data) => {
      expect(data).toEqual(mockSession);
    });
  });

  it('should create a new session', () => {
    service.create(mockSession).subscribe((data) => {
      expect(data).toEqual(mockSession);
    });
  });

  it('should publish an update session', () => {
    service.update('1', mockSession).subscribe((data) => {
      expect(data).toEqual(mockSession);
    });
  });
  // afterEach(() => {
  //   controller.verify();
  // });
});
