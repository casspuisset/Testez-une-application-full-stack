import { HttpClient, HttpClientModule } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { expect } from '@jest/globals';

import { UserService } from './user.service';
import {
  HttpTestingController,
  HttpClientTestingModule,
} from '@angular/common/http/testing';

describe('UserService', () => {
  let service: UserService;
  let controller: HttpTestingController;
  let client: HttpClient;
  let mockUser = {
    id: 1,
    email: 'yoga@studio.com',
    lastName: 'Admin',
    firstName: 'Admin',
    admin: true,
    createdAt: '2025-09-01T19:34:14',
    updatedAt: '2025-09-01T19:34:14',
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientModule, HttpClientTestingModule],
      providers: [UserService, HttpTestingController],
    });
    service = TestBed.inject(UserService);
    client = TestBed.inject(HttpClient);
    controller = TestBed.inject(HttpTestingController);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should get a user by their id', () => {
    service.getById('1').subscribe((user) => {
      expect(user).toEqual(mockUser);
    });
  });

  it('should delete a user when delete is called', () => {
    service.delete('1').subscribe((response) => {
      expect(response).toBeNull();
    });
  });
});
