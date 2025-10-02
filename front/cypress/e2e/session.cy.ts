/// <reference types="cypress" />
/// <reference path="../support/index.d.ts"/>
describe('Login', () => {
  it('should login and display user information', () => {
    cy.login();

    cy.get('span.link[routerLink="me"]').click();

    cy.wait('@userInfoRequest');

    cy.contains('yoga@studio.com').should('be.visible');
    cy.contains('Admin').should('be.visible');

    cy.url().should('include', '/me');
  });

  it('should login then logout', () => {
    cy.login();
    cy.url().should('include', '/sessions');
    cy.contains('Logout').should('be.visible');

    cy.contains('Logout').click();
    cy.get('span.link[routerLink="login"]').should('be.visible');
    cy.url().should('include', '/');
  });
});
describe('Register', () => {
  it('should display an error message when register with an already existing email', () => {
    cy.intercept('POST', '/api/auth/register', {
      statusCode: 409,
      body: {
        message: 'Email already exists',
      },
    }).as('emailExists');
    cy.visit('/register');

    cy.get('input[formControlName=firstName]').type('Test');
    cy.get('input[formControlName=lastName]').type('TEST');
    cy.get('input[formControlName=email]').type('test@test.com');
    cy.get('input[formControlName=password]').type('password');
    cy.get('button[type=submit]').click();

    cy.wait('@emailExists');
    cy.get('.error').should('be.visible');
  });

  it('should activate the submit button when the form is filled', () => {
    cy.visit('/register');
    cy.get('button[type=submit]').should('be.disabled');

    cy.get('input[formControlName=firstName]').type('Test');
    cy.get('input[formControlName=lastName]').type('TEST');
    cy.get('input[formControlName=email]').type('test@test.com');
    cy.get('input[formControlName=password]').type('password');

    cy.get('button[type=submit]').should('not.be.disabled');
  });

  it('should register then redirect to Login page', () => {
    cy.register();

    cy.url().should('include', '/login');
  });

  it('should display an error message in the event of registration failure', () => {
    cy.intercept('POST', '/api/auth/register', {
      statusCode: 500,
    }).as('registerError');
    cy.visit('/register');

    cy.get('input[formControlName=firstName]').type('Test');
    cy.get('input[formControlName=lastName]').type('TEST');
    cy.get('input[formControlName=email]').type('test@test.com');
    cy.get('input[formControlName=password]').type('password');
    cy.get('button[type=submit]').click();

    cy.wait('@registerError');
    cy.get('.error').should('be.visible');
  });
});
describe('Account', () => {
  it('should login and display user information', () => {
    cy.intercept('GET', 'http://localhost:4200/api/user/1', {
      statusCode: 200,
      body: {
        id: 1,
        email: 'yoga@studio.com',
        lastName: 'Admin',
        firstName: 'Admin',
        admin: true,
        createdAt: '2025-09-01 19:34:14',
        updatedAt: '2025-09-01 19:34:14',
      },
    }).as('userInfoRequest');
    cy.login();

    cy.get('span.link[routerLink="me"]').click();

    cy.wait('@userInfoRequest');

    cy.contains('yoga@studio.com').should('be.visible');
    cy.contains('Admin').should('be.visible');
    cy.contains('Admin').should('be.visible');

    cy.url().should('include', '/me');
  });

  it('should return back and delete when respectives buttons are clicked', () => {
    cy.intercept('GET', 'http://localhost:4200/api/user/2', {
      statusCode: 200,
      body: {
        id: 2,
        email: 'test@test.com',
        lastName: 'TEST',
        firstName: 'Test',
        admin: false,
        createdAt: '2025-09-01 19:34:14',
        updatedAt: '2025-09-01 19:34:14',
      },
    }).as('userInfoRequest');
    cy.loginNonAdmin();
    cy.get('span.link[routerLink="me"]').click();

    cy.wait('@userInfoRequest');

    cy.get('span.link[routerlink="me"]').click();
    cy.get('mat-icon').contains('arrow_back').should('be.visible').click();
    cy.url().should('include', '/sessions');
    cy.get('span.link[routerlink="me"]').click();
    cy.get('button[mat-raised-button][color="warn"]')
      .contains('Detail')
      .should('be.visible');
    cy.get('button[mat-raised-button][color="warn"]')
      .contains('Detail')
      .click();

    cy.url().should('include', '/');
  });
});

describe('Session', () => {
  it('should login and display user information', () => {
    cy.intercept('GET', 'http://localhost:4200/api/session', {
      statusCode: 200,
      body: [
        {
          id: 1,
          name: 'premier test',
          date: '2025-09-01T00:00:00.000+00:00',
          teacher_id: 2,
          description: 'première session créée et éditée',
          users: [2],
          createdAt: '2025-09-02T17:32:28',
          updatedAt: '2025-09-02T17:32:40',
        },
      ],
    }).as('SessionInfoRequest');

    cy.login();

    cy.wait('@SessionInfoRequest');

    cy.contains('premier test').should('be.visible');
    cy.contains('première session créée et éditée').should('be.visible');

    cy.url().should('include', '/sessions');
  });

  it('should login and create a session', () => {
    cy.intercept('POST', 'http://localhost:4200/api/session', {
      statusCode: 200,
      body: {
        id: 1,
        name: 'premier test',
        date: '2025-09-01T00:00:00.000+00:00',
        teacher_id: 2,
        description: 'première session créée et éditée',
        users: [2],
        createdAt: '2025-09-02T17:32:28',
        updatedAt: '2025-09-02T17:32:40',
      },
    }).as('SessionPostRequest');

    cy.intercept('GET', 'http://localhost:4200/api/teacher', {
      statusCode: 200,
      body: [
        {
          id: 1,
          lastName: 'DELAHAYE',
          firstName: 'Margot',
          createdAt: '2025-09-01T19:34:13',
          updatedAt: '2025-09-01T19:34:13',
        },
        {
          id: 2,
          lastName: 'THIERCELIN',
          firstName: 'Hélène',
          createdAt: '2025-09-01T19:34:13',
          updatedAt: '2025-09-01T19:34:13',
        },
      ],
    }).as('TeacherInfoRequest');

    cy.login();

    cy.get('button[routerLink="create"]').click();

    cy.wait('@TeacherInfoRequest');

    cy.get('input[formControlName=name]').type('premier test');
    cy.get('input[formControlName=date]').type('2025-09-02');
    cy.get('textarea[formControlName=description]').type(
      'première session créée et éditée'
    );

    cy.get('mat-select[formControlName="teacher_id"]').click();
    cy.get('.mat-select-panel mat-option').first().click();

    cy.get('button[type=submit]').click();

    cy.wait('@SessionPostRequest');

    cy.url().should('include', '/sessions');
  });

  it('should login and update a session', () => {
    cy.intercept('GET', 'http://localhost:4200/api/session', {
      statusCode: 200,
      body: [
        {
          id: 1,
          name: 'premier test',
          date: '2025-09-01T00:00:00.000+00:00',
          teacher_id: 2,
          description: 'première session créée et éditée',
          users: [2],
          createdAt: '2025-09-02T17:32:28',
          updatedAt: '2025-09-02T17:32:40',
        },
      ],
    }).as('SessionsListRequest');

    cy.intercept('PUT', 'http://localhost:4200/api/session/*', {
      statusCode: 200,
      body: {
        id: 1,
        name: 'Update test',
        date: '2025-04-04T00:00:00.000+00:00',
        teacher_id: 2,
        description: 'Yoga session test',
        users: [],
        createdAt: '2025-04-03T20:13:29',
        updatedAt: '2025-04-03T20:13:29',
      },
    }).as('SessionPutRequest');

    cy.intercept('GET', 'http://localhost:4200/api/session/*', {
      statusCode: 200,
      body: {
        id: 1,
        name: 'premier test',
        date: '2025-09-01T00:00:00.000+00:00',
        teacher_id: 2,
        description: 'première session créée et éditée',
        users: [2],
        createdAt: '2025-09-02T17:32:28',
        updatedAt: '2025-09-02T17:32:40',
      },
    }).as('SessionGetRequest');

    cy.intercept('GET', 'http://localhost:4200/api/teacher', {
      statusCode: 200,
      body: [
        {
          id: 1,
          lastName: 'DELAHAYE',
          firstName: 'Margot',
          createdAt: '2025-09-01T19:34:13',
          updatedAt: '2025-09-01T19:34:13',
        },
        {
          id: 2,
          lastName: 'THIERCELIN',
          firstName: 'Hélène',
          createdAt: '2025-09-01T19:34:13',
          updatedAt: '2025-09-01T19:34:13',
        },
      ],
    }).as('TeacherInfoRequest');

    cy.login();

    cy.wait('@SessionsListRequest');

    cy.contains('Edit').click();

    cy.wait('@SessionGetRequest');
    cy.wait('@TeacherInfoRequest');

    cy.get('input[formControlName=name]').clear().type('Update test');
    cy.get('input[formControlName=date]').clear().type('2025-04-04');
    cy.get('textarea[formControlName=description]')
      .clear()
      .type('Yoga session test');

    cy.get('mat-select[formControlName="teacher_id"]').click();
    cy.get('.mat-select-panel mat-option').first().click();

    cy.get('button[type=submit]').click();

    cy.wait('@SessionPutRequest');

    cy.url().should('include', '/sessions');
  });

  it('should login and show session details, then return to home page with back arrow', () => {
    cy.intercept('GET', 'http://localhost:4200/api/session/*', {
      statusCode: 200,
      body: {
        id: 1,
        name: 'premier test',
        date: '2025-09-01T00:00:00.000+00:00',
        teacher_id: 2,
        description: 'première session créée et éditée',
        users: [2],
        createdAt: '2025-09-02T17:32:28',
        updatedAt: '2025-09-02T17:32:40',
      },
    }).as('SessionGetRequest');

    cy.intercept('GET', 'http://localhost:4200/api/session', {
      statusCode: 200,
      body: [
        {
          id: 1,
          name: 'premier test',
          date: '2025-09-01T00:00:00.000+00:00',
          teacher_id: 2,
          description: 'première session créée et éditée',
          users: [2],
          createdAt: '2025-09-02T17:32:28',
          updatedAt: '2025-09-02T17:32:40',
        },
      ],
    }).as('SessionListRequest');

    cy.intercept('GET', 'http://localhost:4200/api/teacher/*', {
      statusCode: 200,
      body: {
        id: 2,
        lastName: 'THIERCELIN',
        firstName: 'Hélène',
        createdAt: '2025-09-01T19:34:13',
        updatedAt: '2025-09-01T19:34:13',
      },
    }).as('TeacherInfoRequest');

    cy.login();

    cy.wait('@SessionListRequest');

    cy.contains('Detail').click();

    cy.wait('@SessionGetRequest');
    cy.wait('@TeacherInfoRequest');

    cy.contains('Premier Test').should('be.visible');
    cy.contains('première session créée et éditée').should('be.visible');
    cy.contains('THIERCELIN').should('be.visible');
    cy.contains('Hélène').should('be.visible');

    cy.url().should('include', '/sessions/detail/1');
    cy.get('mat-icon').contains('arrow_back').should('be.visible').click();
    cy.url().should('include', '/sessions');
  });

  it('should login and delete a session', () => {
    cy.intercept('DELETE', 'http://localhost:4200/api/session/*', {
      statusCode: 200,
      body: {},
    }).as('SessionDeleteRequest');

    cy.intercept('GET', 'http://localhost:4200/api/session', {
      statusCode: 200,
      body: [
        {
          id: 1,
          name: 'premier test',
          date: '2025-09-01T00:00:00.000+00:00',
          teacher_id: 2,
          description: 'première session créée et éditée',
          users: [2],
          createdAt: '2025-09-02T17:32:28',
          updatedAt: '2025-09-02T17:32:40',
        },
      ],
    }).as('SessionListRequest');

    cy.intercept('GET', 'http://localhost:4200/api/session/*', {
      statusCode: 200,
      body: {
        id: 1,
        name: 'premier test',
        date: '2025-09-01T00:00:00.000+00:00',
        teacher_id: 2,
        description: 'première session créée et éditée',
        users: [2],
        createdAt: '2025-09-02T17:32:28',
        updatedAt: '2025-09-02T17:32:40',
      },
    }).as('SessionGetRequest');

    cy.intercept('GET', 'http://localhost:4200/api/teacher/*', {
      statusCode: 200,
      body: {
        id: 2,
        lastName: 'THIERCELIN',
        firstName: 'Hélène',
        createdAt: '2025-09-01T19:34:13',
        updatedAt: '2025-09-01T19:34:13',
      },
    }).as('TeacherInfoRequest');

    cy.login();

    cy.wait('@SessionListRequest');

    cy.contains('Detail').click();

    cy.wait('@SessionGetRequest');
    cy.wait('@TeacherInfoRequest');

    cy.contains('Delete').click();

    cy.wait('@SessionDeleteRequest');

    cy.url().should('include', '/sessions');
  });

  it('should redirect to not found page when url does not exist', () => {
    cy.visit('/doesntexist');

    cy.get('h1').should('contain', 'Page not found !');
    cy.url().should('include', '404');
  });
});
