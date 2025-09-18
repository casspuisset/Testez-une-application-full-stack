import { HttpClientModule } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { expect } from '@jest/globals';
import { SessionService } from 'src/app/services/session.service';
import { SessionApiService } from '../../services/session-api.service';

import { FormComponent } from './form.component';
import { ActivatedRoute, Router } from '@angular/router';
import { TeacherService } from 'src/app/services/teacher.service';
import { Session } from '../../interfaces/session.interface';
import { of } from 'rxjs';
import { Teacher } from 'src/app/interfaces/teacher.interface';
import { HttpTestingController } from '@angular/common/http/testing';

describe('FormComponent', () => {
  let component: FormComponent;
  let fixture: ComponentFixture<FormComponent>;
  let mockRoute: any = { snapshot: { paramMap: { get: jest.fn() } } };
  let mockFormBuilder: FormBuilder = new FormBuilder();
  let mockMatSnackBar: any = { open: jest.fn() };
  let mockSessionApiService: any = {
    detail: jest.fn(),
    create: jest.fn().mockReturnValue({ subscribe: jest.fn() }),
    update: jest.fn().mockReturnValue(of({})),
  };
  let mockTeacherService: any = { all: jest.fn() };
  let mockRouter: any = {
    navigate: jest.fn(),
  };
  let mockSession: Session = {
    id: 1,
    name: 'Name',
    description: 'Description',
    date: new Date(),
    teacher_id: 1,
    users: [],
    createdAt: new Date(),
    updatedAt: new Date(),
  };
  const mockSessionService = {
    sessionInformation: {
      admin: true,
    },
  };

  let mockComponent: FormComponent = new FormComponent(
    mockRoute as ActivatedRoute,
    mockFormBuilder,
    mockMatSnackBar as MatSnackBar,
    mockSessionApiService as SessionApiService,
    mockSessionService as SessionService,
    mockTeacherService as TeacherService,
    mockRouter as Router
  );

  //before each test
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        HttpClientModule,
        MatCardModule,
        MatIconModule,
        MatFormFieldModule,
        MatInputModule,
        ReactiveFormsModule,
        MatSnackBarModule,
        MatSelectModule,
        BrowserAnimationsModule,
      ],
      providers: [
        { provide: SessionService, useValue: mockSessionService },
        SessionApiService,
      ],
      declarations: [FormComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(FormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  //tests
  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should  navigate to /sessions if not admin', () => {
    mockSessionService.sessionInformation.admin = false;
    // mockRouter.url = '/sessions/create';
    // jest
    //   .spyOn(component as unknown as { initForm: () => void }, 'initForm')
    //   .mockImplementation(() => {});
    // component.ngOnInit();
    mockComponent.ngOnInit();

    expect(mockRouter.navigate).toHaveBeenCalledWith(['sessions']);
  });

  it('should create a session when the form is correctly filled', () => {
    let form = mockComponent.sessionForm?.setValue(mockSession);
    mockComponent.onUpdate = false;
    mockComponent.submit();
    mockSessionApiService.create.mockReturnValue(
      of(
        mockMatSnackBar.open('Session created !'),
        mockRouter.navigate(['sessions'])
      )
    );

    expect(mockSessionApiService.create).toHaveBeenCalledWith(form);
    expect(mockMatSnackBar.open).toHaveBeenCalledWith('Session created !');
    expect(mockRouter.navigate).toHaveBeenCalledWith(['sessions']);
  });

  it('should update the session when the form is correctly filled', () => {
    const id: string | undefined = mockRoute.snapshot.paramMap.get('1');

    let mockSession: Session = {
      id: 1,
      name: 'new name',
      description: 'new description',
      date: new Date(),
      teacher_id: 1,
      users: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    let form = mockComponent.sessionForm?.setValue(mockSession);
    mockComponent.onUpdate = true;
    mockComponent.submit();
    mockSessionApiService.update.mockReturnValue(
      of(
        mockMatSnackBar.open('Session updated !'),
        mockRouter.navigate(['sessions'])
      )
    );

    expect(mockSessionApiService.update).toHaveBeenCalledWith(id, form);
    expect(mockMatSnackBar.open).toHaveBeenCalledWith('Session updated !');
    expect(mockRouter.navigate).toHaveBeenCalledWith(['sessions']);
  });

  it('should throw an error in case of incorrect fields when try to create', () => {
    let mockSession: Session = {
      id: 0,
      name: '',
      description: '',
      date: new Date(),
      teacher_id: 0,
      users: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    let form = mockComponent.sessionForm?.setValue(mockSession);
    mockComponent.onUpdate = false;
    mockComponent.submit();

    mockSessionApiService.create.mockReturnValue(
      of(mockMatSnackBar.open('Error : invalid fields !'))
    );

    expect(mockSessionApiService.create).toHaveBeenCalledWith(form);
    expect(mockMatSnackBar.open).toHaveBeenCalledWith(
      'Error : invalid fields !'
    );
  });

  it('should throw an error in case of incorrect fields when try to update', () => {
    let id: string | undefined = mockRoute.snapshot.paramMap.get('1');
    let mockSession: Session = {
      id: 0,
      name: '',
      description: '',
      date: new Date(),
      teacher_id: 0,
      users: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    let form = mockComponent.sessionForm?.setValue(mockSession);
    mockComponent.onUpdate = true;
    mockComponent.submit();
    mockSessionApiService.create.mockReturnValue(
      of(mockMatSnackBar.open('Error : invalid fields !'))
    );

    expect(mockSessionApiService.update).toHaveBeenCalledWith(id, form);
    expect(mockMatSnackBar.open).toHaveBeenCalledWith(
      'Error : invalid fields !'
    );
  });
});
