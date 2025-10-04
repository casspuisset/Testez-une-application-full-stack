import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';
import { DetailComponent } from './detail.component';
import { SessionService } from '../../../../services/session.service';
import { TeacherService } from '../../../../services/teacher.service';
import { SessionApiService } from '../../services/session-api.service';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { ActivatedRoute } from '@angular/router';
import { expect } from '@jest/globals';
import { ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

const mockSessionService = {
  sessionInformation: {
    admin: false,
    id: '1',
  },
};

const mockTeacherService = {
  detail: jest.fn().mockReturnValue(
    of({
      firstName: 'test',
      lastName: 'Test',
    })
  ),
};

const mockSessionApiService = {
  detail: jest.fn().mockReturnValue(
    of({
      name: 'session',
      users: ['user2'],
      teacher_id: 'teacher1',
      date: new Date(),
      description: 'description',
      createdAt: new Date('2025, 9, 27'),
      updatedAt: new Date('2025, 9, 27'),
    })
  ),
  delete: jest.fn().mockReturnValue(of(null)),
  participate: jest.fn().mockReturnValue(of(null)),
  unParticipate: jest.fn().mockReturnValue(of(null)),
};

const mockActivatedRoute = {
  snapshot: {
    paramMap: {
      get: jest.fn().mockReturnValue('mockCall'),
    },
  },
};

describe('DetailComponent', () => {
  let component: DetailComponent;
  let fixture: ComponentFixture<DetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        MatSnackBarModule,
        ReactiveFormsModule,
        MatCardModule,
        MatIconModule,
        MatButtonModule,
      ],
      declarations: [DetailComponent],
      providers: [
        { provide: SessionService, useValue: mockSessionService },
        { provide: TeacherService, useValue: mockTeacherService },
        { provide: SessionApiService, useValue: mockSessionApiService },
        { provide: ActivatedRoute, useValue: mockActivatedRoute },
      ],
    }).compileComponents();
    fixture = TestBed.createComponent(DetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should display session details', () => {
    const integrated = fixture.nativeElement;

    expect(integrated.querySelector('h1').textContent).toContain('Session');
    expect(integrated.querySelector('.description').textContent).toContain(
      'description'
    );
    expect(
      integrated.querySelector('mat-card-subtitle .ml1').textContent
    ).toContain('test TEST');
  }); ///i

  it('should participate in the session when participate button is clicked', () => {
    component.isParticipate = false;
    fixture.detectChanges();

    const participateButton = fixture.nativeElement.querySelector(
      'button[color="primary"]'
    );
    participateButton.click();

    expect(mockSessionApiService.participate).toHaveBeenCalledWith(
      'mockCall',
      '1'
    );
  }); ///i

  it('should unparticipate in the session when unparticipate button is clicked', () => {
    component.isParticipate = true;
    fixture.detectChanges();

    const unparticipateButton = fixture.nativeElement.querySelector(
      'button[color="warn"]'
    );
    unparticipateButton.click();

    expect(mockSessionApiService.unParticipate).toHaveBeenCalledWith(
      'mockCall',
      '1'
    );
  }); ///i

  it('should delete the session and navigate when delete button is clicked', () => {
    component.isAdmin = true;
    fixture.detectChanges();

    const deleteButton = fixture.nativeElement.querySelector(
      'button[color="warn"]'
    );
    deleteButton.click();

    expect(mockSessionApiService.delete).toHaveBeenCalledWith('mockCall');
  }); ///i

  it('should display all information of the session', () => {
    component.ngOnInit();
    fixture.detectChanges();
    let integrated = fixture.nativeElement;

    expect(integrated.querySelector('h1').textContent).toContain('Session');
    expect(
      integrated.querySelector('mat-card-subtitle span').textContent
    ).toContain('test TEST');
    expect(integrated.querySelector('.description').textContent).toContain(
      'description'
    );
    expect(integrated.querySelector('.created').textContent).toContain(
      'Create at:  September 27, 2025'
    );
    expect(integrated.querySelector('.updated').textContent).toContain(
      'Last update:  September 27, 2025'
    );
  }); ///i

  it('should not display delete button if user is not admin', () => {
    let integrated = fixture.nativeElement;
    expect(
      integrated.querySelector('button[mat-raised-button][color="warn"]')
    ).toBeNull();
  }); ///i

  it('should display delete button if user is admin', () => {
    component.isAdmin = true;
    fixture.detectChanges();
    let integrated = fixture.nativeElement;
    expect(
      integrated.querySelector('button[mat-raised-button][color="warn"]')
        .textContent
    ).toContain('Delete');
  }); ///i
});
