import { HttpClientModule } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { RouterTestingModule } from '@angular/router/testing';
import { expect } from '@jest/globals';
import { SessionService } from '../../../../services/session.service';
import { DetailComponent } from './detail.component';
import { ActivatedRoute, Router } from '@angular/router';
import { TeacherService } from 'src/app/services/teacher.service';
import { SessionApiService } from '../../services/session-api.service';
import { of } from 'rxjs';
import { Session } from '../../interfaces/session.interface';
import { Teacher } from 'src/app/interfaces/teacher.interface';

describe('DetailComponent', () => {
  let component: DetailComponent;
  let fixture: ComponentFixture<DetailComponent>;
  let service: SessionService;
  let mockRoute: any = { snapshot: { paramMap: { get: jest.fn() } } };
  let mockFormBuilder: FormBuilder = new FormBuilder();
  const mockSessionService = {
    sessionInformation: {
      admin: true,
      id: 1,
    },
  };
  let mockSessionApiService: any = {
    delete: jest.fn().mockReturnValue({ subscribe: jest.fn() }),
    participate: jest.fn().mockReturnValue({ subscribe: jest.fn() }),
    unParticipate: jest.fn().mockReturnValue({ subscribe: jest.fn() }),
    detail: jest.fn().mockReturnValue({ subscribe: jest.fn() }),
  };

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

  let mockTeacher: Teacher = {
    id: 2,
    lastName: 'THIERCELIN',
    firstName: 'Hélène',
    createdAt: new Date('2025-09-01T19:34:13'),
    updatedAt: new Date('2025-09-01T19:34:13'),
  };

  let mockTeacherService: any = {
    detail: jest.fn(),
  };

  let mockMatSnackBar: any = {
    open: jest.fn(),
  };

  let mockRouter: any = {
    navigate: jest.fn(),
  };

  let mockComponent: DetailComponent = new DetailComponent(
    mockRoute as ActivatedRoute,
    mockFormBuilder,
    mockSessionService as SessionService,
    mockSessionApiService as SessionApiService,
    mockTeacherService as TeacherService,
    mockMatSnackBar as MatSnackBar,
    mockRouter as Router
  );

  let sessionId = mockRoute.snapshot.paramMap.get('id');

  //before each tests
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        HttpClientModule,
        MatSnackBarModule,
        ReactiveFormsModule,
      ],
      declarations: [DetailComponent],
      providers: [{ provide: SessionService, useValue: mockSessionService }],
    }).compileComponents();
    service = TestBed.inject(SessionService);
    fixture = TestBed.createComponent(DetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  //test
  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should create a card for a session when session exists', () => {
    mockComponent.session = mockSession;
    let matCard = document.querySelector('mat-card');
    expect(matCard).not.toBeNull;
  });

  it('should delete a session when delete is called', () => {
    mockComponent.delete();
    mockSessionApiService.delete.mockReturnValue(
      of(
        mockMatSnackBar.open('Session deleted !'),
        mockRouter.navigate(['sessions'])
      )
    );

    expect(mockSessionApiService.delete).toHaveBeenCalledWith(sessionId);
    expect(mockMatSnackBar.open).toHaveBeenCalledWith('Session deleted !');
    expect(mockRouter.navigate).toHaveBeenCalledWith(['sessions']);
  });

  // it('should fetch a session when fetchsession is called', () => {
  //   (mockSessionApiService as any).fetchSession().mockReturnValue(
  //     of(
  //       (mockComponent.session = mockSession),
  //       (mockComponent.isParticipate = mockSession.users.some(
  //         (u) => u === mockSessionService.sessionInformation!.id
  //       )),
  //       mockTeacherService
  //         .detail(mockSession.teacher_id.toString())
  //         .subscribe((teacher: Teacher) => (teacher = mockTeacher))
  //     )
  //   );
  //   ///à voir ce qui coince
  //   expect(mockSessionApiService.detail).toHaveBeenCalledWith(sessionId);
  // });
  it('should participate in the session and fetch the session again', () => {
    mockSessionApiService.participate.mockReturnValue(of());

    component.sessionId = sessionId;
    component.userId = '2';

    component.participate();

    expect(mockSessionApiService.participate).toHaveBeenCalledWith(
      sessionId,
      '1'
    );
  });

  it('should fetch the session and call teacher service with it', () => {
    // mockTeacherService.mockReturnValue(
    //   of((mockComponent.teacher = mockTeacher))
    // );
    mockSessionApiService.fetchSession();
    mockSessionApiService.detail.mockReturnValue(
      of(
        (mockComponent.session = mockSession),
        (mockComponent.isParticipate = true),
        mockTeacher
      )
    );

    expect(mockSessionApiService).toHaveBeenCalledWith(sessionId);
    expect(mockTeacherService).toHaveBeenCalled();
    expect(mockComponent.session).toHaveBeenCalledWith(mockSession);
    expect(mockComponent.isParticipate).toHaveBeenCalledWith(true);
  });

  it('should render the delete button if user is an admin', () => {
    mockComponent.isAdmin = true;
    const button = document.querySelector('.isAdmin');
    expect(button).not.toBeNull;
  });

  it('should not render the delete button if user is not an admin', () => {
    mockComponent.isAdmin = false;
    const button = document.querySelector('.isAdmin');
    expect(button).toBeNull;
  });

  it('should navigate back when back is called', () => {
    const spyBack = jest
      .spyOn(window.history, 'back')
      .mockImplementation(() => {});
    component.back();

    expect(spyBack).toHaveBeenCalled();
    spyBack.mockRestore();
  });
});
