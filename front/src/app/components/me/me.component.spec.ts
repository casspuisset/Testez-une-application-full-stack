import { HttpClientModule } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { SessionService } from 'src/app/services/session.service';
import { expect, jest } from '@jest/globals';

import { MeComponent } from './me.component';
import { Router } from '@angular/router';
import { UserService } from 'src/app/services/user.service';
import { User } from 'src/app/interfaces/user.interface';

describe('MeComponent', () => {
  let component: MeComponent;
  let fixture: ComponentFixture<MeComponent>;
  let mockComponent: MeComponent;
  let mockRouter: any;
  let mockMatSnackBar!: MatSnackBar;
  let mockUserService: any = {
    getById: jest.fn().mockReturnValue({ subscribe: jest.fn() }),
  };
  const mockSessionService = {
    sessionInformation: {
      admin: true,
      id: 1,
    },
  };

  const mockUser: User = {
    id: 1,
    email: 'test@example.com',
    firstName: 'firstname',
    lastName: 'lastname',
    admin: true,
    password: 'test',
    createdAt: new Date(),
  };

  //initialisation before each test
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MeComponent],
      imports: [
        MatSnackBarModule,
        HttpClientModule,
        MatCardModule,
        MatFormFieldModule,
        MatIconModule,
        MatInputModule,
      ],
      providers: [{ provide: SessionService, useValue: mockSessionService }],
    }).compileComponents();

    fixture = TestBed.createComponent(MeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    mockComponent = new MeComponent(
      mockRouter as Router,
      mockSessionService as SessionService,
      mockMatSnackBar as MatSnackBar,
      mockUserService as UserService
    );
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  // it('should load user data on init', () => {
  //   expect(mockUserService.getById).toHaveBeenCalledWith('1');
  //   expect(component.user).toEqual(mockUser);
  // });

  it('should navigate back when back is called', () => {
    const spyBack = jest
      .spyOn(window.history, 'back')
      .mockImplementation(() => {});
    component.back();

    expect(spyBack).toHaveBeenCalled();
    spyBack.mockRestore();
  });

  // it('should delete user account when delete is called', () => {
  //   component.delete();

  //   expect(mockUserService.delete).toHaveBeenCalledWith('1');
  //   expect(mockMatSnackBar.open).toHaveBeenCalledWith(
  //     'Your account has been deleted !',
  //     'Close',
  //     { duration: 3000 }
  //   );
  //   // expect(mockSessionService.logOut).toHaveBeenCalled();
  //   expect(mockRouter.navigate).toHaveBeenCalledWith(['/']);
  // });
});
