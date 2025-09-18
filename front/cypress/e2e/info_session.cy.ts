/// <reference types="cypress" />
import 'cypress-mochawesome-reporter/register';

describe('Information session spec', () => {
  const months = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];

  function capitalize(str: string) {
    let fractionStr = str.split(' ');
    for (let i = 0; i < 2; i++) {
      fractionStr[i] =
        fractionStr[i].charAt(0).toUpperCase() + fractionStr[i].slice(1);
    }
    return fractionStr.join(' ');
  }
  it('Shows session informations', () => {
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

    const session = {
      id: 1,
      name: 'premier test',
      date: '2025-09-01 02:00:00',
      teacher_id: 2,
      description: 'première session créée et éditée',
      users: [2],
      createdAt: '2025-09-02T17:32:28',
      updatedAt: '2025-09-02T17:32:40',
    };

    cy.intercept('GET', '/api/session/1', { body: session });

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

    const teacher = {
      id: 2,
      lastName: 'THIERCELIN',
      firstName: 'Hélène',
      createdAt: '2025-09-01T19:34:13',
      updatedAt: '2025-09-01T19:34:13',
    };

    cy.intercept('GET', '/api/teacher/2', teacher);

    cy.get('input[formControlName=email]').type('yoga@studio.com');
    cy.get('input[formControlName=password]').type(
      `${'test!12345'}{enter}{enter}`
    );

    cy.get('.mat-raised-button').should('be.enabled');
    cy.url().should('include', '/sessions');

    cy.contains('Rentals available').should('be.visible');
    sessions.forEach((session) => {
      cy.contains(session.name).should('be.visible');
      cy.contains(session.description).should('be.visible');
      const picture = cy.get('img.picture');
      picture.should('have.attr', 'src', 'assets/sessions.png');
      picture.should('have.attr', 'alt', 'Yoga session');
      const year = session.date.slice(0, 10).split('-')[0];
      let month = months[Number(session.date.slice(0, 10).split('-')[1]) - 1];
      const day = Number(session.date.slice(0, 10).split('-')[2]);
      const date = `Session on ${month} ${day}, ${year}`;
      cy.contains(date).should('be.visible');
      cy.contains('Detail').should('be.visible');
    });

    cy.contains('Detail').click();

    cy.url().should('include', '/sessions/detail/1');

    let capitalizedName = capitalize(session.name);
    cy.contains(capitalizedName).should('be.visible');
    cy.contains(`${teacher.firstName} ${teacher.lastName}`).should(
      'be.visible'
    );

    const picture = cy.get('img.picture');
    picture.should('have.attr', 'src', 'assets/sessions.png');
    picture.should('have.attr', 'alt', 'Yoga session');
    cy.contains(`${session.users.length} attendees`).should('be.visible');

    const year = session.date.slice(0, 10).split('-')[0];
    let month = months[Number(session.date.slice(0, 10).split('-')[1]) - 1];
    const day = Number(session.date.slice(0, 10).split('-')[2]);
    cy.contains(`${month} ${day}, ${year}`).should('be.visible');

    cy.contains('Description:').should('be.visible');
    cy.contains(session.description).should('be.visible');

    const createYear = session.createdAt.slice(0, 10).split('-')[0];
    let createMonth =
      months[Number(session.date.slice(0, 10).split('-')[1]) - 1];
    const createDay = Number(session.createdAt.slice(0, 10).split('-')[2]);
    const updateYear = session.updatedAt.slice(0, 10).split('-')[0];
    let updateMonth =
      months[Number(session.date.slice(0, 10).split('-')[1]) - 1];
    const updateDay = Number(session.updatedAt.slice(0, 10).split('-')[2]);

    cy.contains(`${createMonth} ${createDay}, ${createYear}`).should(
      'be.visible'
    );
    cy.contains(`${updateMonth} ${updateDay}, ${updateYear}`).should(
      'be.visible'
    );
  });

  it('Shows delete button for admin user', () => {
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

    const session = {
      id: 1,
      name: 'premier test',
      date: '2025-09-01 02:00:00',
      teacher_id: 2,
      description: 'première session créée et éditée',
      users: [2],
      createdAt: '2025-09-02T17:32:28',
      updatedAt: '2025-09-02T17:32:40',
    };

    cy.intercept('GET', '/api/session/1', { body: session });

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

    const teacher = {
      id: 2,
      lastName: 'THIERCELIN',
      firstName: 'Hélène',
      createdAt: '2025-09-01T19:34:13',
      updatedAt: '2025-09-01T19:34:13',
    };

    cy.intercept('GET', '/api/teacher/2', teacher);

    cy.get('input[formControlName=email]').type('yoga@studio.com');
    cy.get('input[formControlName=password]').type(
      `${'test!12345'}{enter}{enter}`
    );

    cy.get('.mat-raised-button').should('be.enabled');
    cy.url().should('include', '/sessions');

    cy.contains('Rentals available').should('be.visible');
    sessions.forEach((session) => {
      cy.contains(session.name).should('be.visible');
      cy.contains(session.description).should('be.visible');
      const picture = cy.get('img.picture');
      picture.should('have.attr', 'src', 'assets/sessions.png');
      picture.should('have.attr', 'alt', 'Yoga session');
      const year = session.date.slice(0, 10).split('-')[0];
      const month = months[Number(session.date.slice(0, 10).split('-')[1]) - 1];
      const day = Number(session.date.slice(0, 10).split('-')[2]);
      const date = `Session on ${month} ${day}, ${year}`;
      cy.contains(date).should('be.visible');
      cy.contains('Detail').should('be.visible');
    });

    cy.contains('Detail').click();

    cy.url().should('include', '/sessions/detail/1');

    const deleteButton = cy.get('button[mat-raised-button]');
    deleteButton.get('mat-icon').should('contain', 'delete');
    deleteButton.get('span.ml1').should('contain', 'Delete');
    deleteButton.contains('Delete').should('be.visible');
  });
});

//en cours
