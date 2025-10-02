import { HttpClientModule } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { expect } from '@jest/globals';
import { SessionService } from 'src/app/services/session.service';
import { ListComponent } from './list.component';
import { Session } from '../../interfaces/session.interface';
import { of } from 'rxjs';
import { SessionApiService } from '../../services/session-api.service';

describe('ListComponent', () => {
  let component: ListComponent;
  let fixture: ComponentFixture<ListComponent>;
  let mockSession: Session[] = [
    {
      id: 1,
      name: 'premier test',
      date: new Date('2025-09-01T00:00:00.000+00:00'),
      teacher_id: 2,
      description: 'première session créée et éditée',
      users: [2],
      createdAt: new Date('2025-09-02T17:32:28'),
      updatedAt: new Date('2025-09-02T17:32:40'),
    },
  ];

  const mockSessionService = {
    sessionInformation: {
      admin: true,
    },
  };

  const mockSessionApiService = {
    all: jest.fn().mockReturnValue(
      of([
        {
          id: 1,
          name: 'premier test',
          date: new Date('2025-09-01T00:00:00.000+00:00'),
          teacher_id: 2,
          description: 'première session créée et éditée',
          users: [2],
          createdAt: new Date('2025-09-02T17:32:28'),
          updatedAt: new Date('2025-09-02T17:32:40'),
        },
        {
          id: 2,
          name: 'deuxième test',
          date: new Date('2025-09-01T00:00:00.000+00:00'),
          teacher_id: 2,
          description: 'deuxième session',
          users: [2],
          createdAt: new Date('2025-09-02T17:32:28'),
          updatedAt: new Date('2025-09-02T17:32:40'),
        },
      ])
    ),
  };

  //before each test
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ListComponent],
      imports: [HttpClientModule, MatCardModule, MatIconModule],
      providers: [
        { provide: SessionService, useValue: mockSessionService },
        { provide: SessionApiService, useValue: mockSessionApiService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  //tests
  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display sessions', () => {
    let integrated = fixture.nativeElement;

    expect(integrated.querySelectorAll('.item').length).toBe(2);
    expect(
      integrated.querySelector('.item mat-card-title').textContent
    ).toContain('premier test');
    expect(
      integrated.querySelector('.item mat-card-subtitle').textContent
    ).toContain('Session on');
  }); ///i

  it('should display create and edit buttons when user is an admin', () => {
    let integrated = fixture.nativeElement;

    expect(integrated.querySelector('mat-raised-button[routerLink="create"]'))
      .toBeTruthy;
    expect(integrated.querySelector('mat-raised-button[routerLink="update"]'))
      .toBeTruthy;
  }); ///i

  it('should not display create and edit buttons when user is not an admin', () => {
    component.user!.admin = false;
    fixture.detectChanges();
    let integrated = fixture.nativeElement;

    expect(integrated.querySelector('mat-raised-button[routerLink="create"]'))
      .toBeFalsy;
    expect(integrated.querySelector('mat-raised-button[routerLink="update"]'))
      .toBeFalsy;
  }); ///i
});
