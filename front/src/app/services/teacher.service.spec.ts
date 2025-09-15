import { HttpClientModule } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { expect } from '@jest/globals';

import { TeacherService } from './teacher.service';
import { HttpTestingController } from '@angular/common/http/testing';

describe('TeacherService', () => {
  let service: TeacherService;
  let controller: HttpTestingController;
  let mockAllTeachers = [
    {
      id: 1,
      lastName: 'DELAHAYE',
      firstName: 'Margot',
      createdAt: '2025-09-01T19:34:13',
      updatedAt: '2025-09-01T19:34:13',
    },
    {
      id: 2,
      lastName: 'THIERCELIN',
      firstName: 'Hélène',
      createdAt: '2025-09-01T19:34:13',
      updatedAt: '2025-09-01T19:34:13',
    },
  ];
  let mockOneTeacher = {
    id: 1,
    lastName: 'DELAHAYE',
    firstName: 'Margot',
    createdAt: '2025-09-01T19:34:13',
    updatedAt: '2025-09-01T19:34:13',
  };
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientModule],
      providers: [TeacherService, HttpTestingController],
    });
    service = TestBed.inject(TeacherService);
    controller = TestBed.inject(HttpTestingController);
  });

  // afterEach(() => {
  //   controller.verify();
  // });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should retrieve all teachers when all is called', () => {
    service.all().subscribe((value) => {
      expect(value).toEqual(mockAllTeachers);
    });
  });

  it('should retrieve a teacher by their id', () => {
    service.detail('1').subscribe((value) => {
      expect(value).toEqual(mockOneTeacher);
    });
  });
});
