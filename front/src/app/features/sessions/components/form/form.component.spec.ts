import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { of } from 'rxjs';
import { FormComponent } from './form.component';
import { SessionService } from '../../../../services/session.service';
import { TeacherService } from '../../../../services/teacher.service';
import { SessionApiService } from '../../services/session-api.service';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { expect } from '@jest/globals';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { Router } from '@angular/router';

let component: FormComponent;
let fixture: ComponentFixture<FormComponent>;

const mockSessionService = {
  sessionInformation: {
    admin: true,
    id: '1',
  },
};

const mockTeacherService = {
  all: jest
    .fn()
    .mockReturnValue(of([{ id: '1', firstName: 'Test', lastName: 'TEST' }])),
};

const mockSessionApiService = {
  detail: jest.fn().mockReturnValue(
    of({
      id: '1',
      name: 'Session',
      date: new Date(),
      description: 'description',
      teacher_id: '1',
    })
  ),
  create: jest.fn().mockReturnValue(of({})),
  update: jest.fn().mockReturnValue(of({})),
};

describe('FormComponent', () => {
  let router: Router;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        ReactiveFormsModule,
        MatCardModule,
        MatIconModule,
        MatButtonModule,
        MatFormFieldModule,
        MatInputModule,
        MatSelectModule,
        MatSnackBarModule,
        NoopAnimationsModule,
      ],
      declarations: [FormComponent],
      providers: [
        { provide: SessionService, useValue: mockSessionService },
        { provide: TeacherService, useValue: mockTeacherService },
        { provide: SessionApiService, useValue: mockSessionApiService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(FormComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    jest
      .spyOn(router, 'navigate')
      .mockImplementation(() => Promise.resolve(true));
    fixture.detectChanges();
  });

  //tests
  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display a form to create a session', () => {
    let integrated = fixture.nativeElement;

    expect(integrated.querySelector('h1').textContent).toContain(
      'Create session'
    );
    expect(integrated.querySelector('form')).toBeTruthy();
  }); ///i

  it('should display a form to update a session', () => {
    component.onUpdate = true;
    fixture.detectChanges();
    let integrated = fixture.nativeElement;

    expect(integrated.querySelector('h1').textContent).toContain(
      'Update session'
    );
    expect(integrated.querySelector('form')).toBeTruthy();
  }); ///i

  it('should submit the form and create the session when update button is clicked on create form', () => {
    component.onUpdate = false;
    fixture.detectChanges();

    component.sessionForm?.setValue({
      name: 'New Session',
      date: new Date().toISOString().split('T')[0],
      teacher_id: '1',
      description: 'New description.',
    });

    fixture.detectChanges();
    component.submit();
    fixture.detectChanges();

    expect(mockSessionApiService.create).toHaveBeenCalledWith({
      name: 'New Session',
      date: new Date().toISOString().split('T')[0],
      teacher_id: '1',
      description: 'New description.',
    });
  }); ///i

  it('should submit the form and update a session when update submit is clicked on update form', () => {
    component.onUpdate = true;
    (component as any).id = '1';
    fixture.detectChanges();

    component.sessionForm?.setValue({
      name: 'Updated Session',
      date: new Date().toISOString().split('T')[0],
      teacher_id: '1',
      description: 'Updated description.',
    });

    fixture.detectChanges();
    component.submit();
    fixture.detectChanges();

    expect(mockSessionApiService.update).toHaveBeenCalledWith('1', {
      name: 'Updated Session',
      date: new Date().toISOString().split('T')[0],
      teacher_id: '1',
      description: 'Updated description.',
    });
  }); ///i
});
