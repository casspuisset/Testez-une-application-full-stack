import { HttpClientModule } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { expect } from '@jest/globals';
import { SessionService } from 'src/app/services/session.service';
import { ListComponent } from './list.component';
import { Session } from '../../interfaces/session.interface';

describe('ListComponent', () => {
  let component: ListComponent;
  let fixture: ComponentFixture<ListComponent>;

  const mockSessionService = {
    sessionInformation: {
      admin: true,
    },
  };

  //before each test
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ListComponent],
      imports: [HttpClientModule, MatCardModule, MatIconModule],
      providers: [{ provide: SessionService, useValue: mockSessionService }],
    }).compileComponents();

    fixture = TestBed.createComponent(ListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  //tests
  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should return session information', () => {
    let session: Session[] = [
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

    component.sessions$.subscribe((data) => {
      session = data;
    });

    expect(session).toEqual([
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
    ]);
  });
});
