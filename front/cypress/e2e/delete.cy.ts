/// <reference types="cypress" />
import 'cypress-mochawesome-reporter/register';

describe('Delete spec', () => {
  it('Deletes session', () => {
    cy.visit('/login');

    cy.intercept('POST', '/api/auth/login', {
      body: {
        id: 1,
        username: 'yoga@studio.com',
        firstName: 'Admin',
        lastName: 'Admin',
        admin: true,
      },
    });

    const sessions = [
      {
        id: 1,
        name: 'premier test',
        date: '2025-09-01 02:00:00',
        teacher_id: 2,
        description: 'première session créée et éditée',
        users: [2],
        createdAt: '2025-09-02T17:32:28',
        updatedAt: '2025-09-02T17:32:40',
      },
    ];

    cy.intercept('GET', '/api/session', {
      body: sessions,
    });

    const teachers = [
      {
        id: 1,
        lastName: 'DELAHAYE',
        firstName: 'Margot',
        createdAt: '2023-08-29 18:57:01',
        updatedAt: '2023-08-29 18:57:01',
      },
      {
        id: 2,
        lastName: 'THIERCELIN',
        firstName: 'Hélène',
        createdAt: '2023-08-29 18:57:01',
        updatedAt: '2023-08-29 18:57:01',
      },
    ];

    cy.intercept('GET', '/api/teacher', teachers);

    cy.get('input[formControlName=email]').type('yoga@studio.com');
    cy.get('input[formControlName=password]').type(
      `${'test!12345'}{enter}{enter}`
    );

    cy.get('.mat-raised-button').should('be.enabled');
    cy.url().should('include', '/sessions');

    let session = {
      id: 1,
      name: 'premier test',
      date: '2025-09-01 02:00:00',
      teacher_id: 2,
      description: 'première session créée et éditée',
      users: [2],
      createdAt: '2025-09-02T17:32:28',
      updatedAt: '2025-09-02T17:32:40',
    };

    const teacher = teachers.find(
      (teacher) => teacher.id == session.teacher_id
    );

    cy.intercept('GET', `/api/session/${session.id}`, session);
    cy.intercept('GET', `/api/teacher/${session.teacher_id}`, teacher);
    cy.contains('Detail').click();

    cy.url().should('include', `/sessions/detail/${session.id}`);

    cy.intercept('DELETE', `/api/session/${session.id}`, {});

    const sessionsList = sessions.filter((s) => s.id !== session.id);

    cy.intercept('GET', '/api/session', {
      body: sessionsList,
    });

    cy.contains('Delete').click();

    cy.url().should('include', '/sessions');
  });
});

//en cours
