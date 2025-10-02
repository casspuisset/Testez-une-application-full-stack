import { HttpClientModule } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { SessionService } from 'src/app/services/session.service';
import { MeComponent } from './me.component';
import { UserService } from '../../services/user.service';
import { of } from 'rxjs';
import { expect } from '@jest/globals';
import { Router } from '@angular/router';

describe('MeComponent', () => {
  let component: MeComponent;
  let fixture: ComponentFixture<MeComponent>;

  const mockRouter = {
    navigate: jest.fn(() => Promise.resolve(true)),
  };

  const mockUser = {
    id: 1,
    firstName: 'test',
    lastName: 'Test',
    email: 'test@test.com',
    admin: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockSessionService = {
    sessionInformation: {
      admin: true,
      id: 1,
    },
    logOut: jest.fn(),
  };

  const mockUserService = {
    getById: jest.fn(() => of(mockUser)),
    delete: jest.fn(() => of({})),
  };

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
      providers: [
        { provide: SessionService, useValue: mockSessionService },
        { provide: UserService, useValue: mockUserService },
        { provide: Router, useValue: mockRouter },
        { provide: MatSnackBar, useValue: { open: jest.fn() } },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(MeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load user data on init', () => {
    expect(mockUserService.getById).toHaveBeenCalledWith(
      mockUser.id.toString()
    );
    expect(component.user).toEqual(mockUser);
  });

  it('should display delete button if user is not admin', () => {
    let newUser = { ...mockUser, admin: false };

    mockUserService.getById.mockReturnValueOnce(of(newUser));

    component.ngOnInit();
    fixture.detectChanges();

    const integrated = fixture.nativeElement;
    expect(integrated.querySelector('button[color="warn"]')).not.toBeNull();
    expect(integrated.textContent).toContain('Detail');
  }); ///i

  it('should navigate back when back is called', () => {
    const spyBack = jest
      .spyOn(window.history, 'back')
      .mockImplementation(() => {});
    component.back();

    expect(spyBack).toHaveBeenCalled();
    spyBack.mockRestore();
  });

  it('should display user information', () => {
    let integrated = fixture.nativeElement;

    expect(integrated.textContent).toContain('Name: test TEST');
    expect(integrated.textContent).toContain('Email: test@test.com');
    expect(integrated.textContent).toContain('You are admin');
    expect(integrated.textContent).toContain('Create at:');
    expect(integrated.textContent).toContain('Last update:');
  }); ///i

  it('should delete user account when delete is called', () => {
    const navigateSpy = jest
      .spyOn(component['router'], 'navigate')
      .mockResolvedValue(true);

    component.delete();

    expect(mockUserService.delete).toHaveBeenCalledWith('1');

    mockUserService.delete.mockReturnValue(of({}));
    expect(mockSessionService.logOut).toHaveBeenCalled();
    expect(navigateSpy).toHaveBeenCalledWith(['/']);

    navigateSpy.mockRestore();
  });
});
