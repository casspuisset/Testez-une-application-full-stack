import { HttpClientModule } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { expect } from '@jest/globals';
import { of, throwError } from 'rxjs';
import { RegisterComponent } from './register.component';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { RegisterRequest } from '../../interfaces/registerRequest.interface';

describe('RegisterComponent', () => {
  let component: RegisterComponent;
  let fixture: ComponentFixture<RegisterComponent>;
  let mockAuthService: any = {
    register: jest.fn().mockReturnValue({ subscribe: jest.fn() }),
  };
  let mockFormBuilder: FormBuilder = new FormBuilder();
  let mockRouter: any = { navigate: jest.fn() };
  let mockComponent: RegisterComponent = new RegisterComponent(
    mockAuthService as AuthService,
    mockFormBuilder,
    mockRouter as Router
  );

  //initialisation before each test
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RegisterComponent],
      imports: [
        BrowserAnimationsModule,
        HttpClientModule,
        ReactiveFormsModule,
        MatCardModule,
        MatFormFieldModule,
        MatIconModule,
        MatInputModule,
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(RegisterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  //test
  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('Should register successfully if email and password match', () => {
    const mockRequest: RegisterRequest = {
      email: 'test@test.com',
      lastName: 'lastName',
      firstName: 'firstName',
      password: 'test',
    };

    mockComponent.form.setValue(mockRequest);
    mockAuthService.register.mockReturnValue(of(mockRequest));
    mockComponent.submit();

    expect(mockAuthService.register).toHaveBeenCalledWith(mockRequest);
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/login']);
  });

  it('Should throw an error in case of invalid field', () => {
    const mockEmptyRequest: RegisterRequest = {
      email: '',
      firstName: '',
      lastName: '',
      password: '',
    };

    mockComponent.form.setValue(mockEmptyRequest);
    mockAuthService.register.mockReturnValue(
      throwError(() => {
        new Error('Error : invalid fields !');
      })
    );
    mockComponent.submit();

    expect(mockComponent.onError).toBeTruthy();
    expect(mockRouter.navigate).not.toHaveBeenCalledWith();
  });
});
