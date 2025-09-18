/// <reference types="cypress" />
import 'cypress-mochawesome-reporter/register';

describe('Detail spec', () => {
  it('Participate to session', () => {
    cy.visit('/login');

    const user = {
      id: 4,
      username: 'toto3@toto.com',
      firstName: 'toto',
      lastName: 'toto',
      admin: false,
    };
    cy.intercept('POST', '/api/auth/login', {
      body: user,
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

    cy.get('input[formControlName=email]').type('toto3@toto.com');
    cy.get('input[formControlName=password]').type(
      `${'test!1234'}{enter}{enter}`
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

    cy.intercept('GET', '/api/session/1', {
      body: session,
    });

    cy.intercept('GET', `/api/teacher/${session.id}`, teacher);

    const sessionCard = cy.get('.items > :nth-child(1)');
    sessionCard.contains('Detail').click();
    cy.contains('Participate').should('be.visible');

    cy.intercept('POST', `/api/session/1/participate/${user.id}`, {});
    cy.intercept('GET', '/api/session/1', {
      id: 1,
      name: 'premier test',
      date: '2025-09-01 02:00:00',
      teacher_id: 2,
      description: 'première session créée et éditée',
      users: [2],
      createdAt: '2025-09-02T17:32:28',
      updatedAt: '2025-09-02T17:32:40',
    });
    cy.contains('Participate').click();
  });

  it('Cancel participation', () => {
    cy.visit('/login');

    const user = {
      id: 4,
      username: 'toto3@toto.com',
      firstName: 'toto',
      lastName: 'toto',
      admin: false,
    };
    cy.intercept('POST', '/api/auth/login', {
      body: user,
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

    cy.get('input[formControlName=email]').type('toto3@toto.com');
    cy.get('input[formControlName=password]').type(
      `${'test!1234'}{enter}{enter}`
    );

    cy.get('.mat-raised-button').should('be.enabled');
    cy.url().should('include', '/sessions');

    let session = {
      id: 1,
      name: 'session 1',
      description: 'my description',
      date: '2012-01-01 01:00:00',
      teacher_id: 1,
      users: [user.id],
      createdAt: '2023-09-08 18:45:03',
      updatedAt: '2023-09-12 23:23:22',
    };

    const teacher = teachers.find(
      (teacher) => teacher.id == session.teacher_id
    );

    cy.intercept('GET', '/api/session/1', {
      body: session,
    });

    cy.intercept('GET', `/api/teacher/${session.id}`, teacher);

    const sessionCard = cy.get('.items > :nth-child(1)');
    sessionCard.contains('Detail').click();

    cy.intercept('DELETE', `/api/session/1/participate/${user.id}`, {});
    cy.intercept('GET', '/api/session/1', {
      id: 1,
      name: 'session 1',
      description: 'my description',
      date: '2012-01-01 01:00:00',
      teacher_id: 1,
      users: [],
      createdAt: '2023-09-08 18:45:03',
      updatedAt: '2023-09-12 23:23:22',
    });

    const doNotParticipateButton = cy.contains('Do not participate');
    doNotParticipateButton.should('be.visible');
    doNotParticipateButton.click();
  });
});

//en cours
