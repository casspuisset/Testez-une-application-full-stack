/// <reference types="cypress" />
import 'cypress-mochawesome-reporter/register';

describe('List spec', () => {
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
  it('Shows list of sessions for admin', () => {
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
        description: 'première session créée et éditée',
        date: '2025-09-01 02:00:00',
        teacher_id: 2,
        users: [],
        createdAt: '2025-09-02 17:32:28',
        updatedAt: '2025-09-02 17:32:40',
      },
    ];

    cy.intercept('GET', '/api/session', {
      body: sessions,
    });

    cy.get('input[formControlName=email]').type('yoga@studio.com');
    cy.get('input[formControlName=password]').type(
      `${'test!12345'}{enter}{enter}`
    );

    cy.get('.mat-raised-button').should('be.enabled');
    cy.url().should('include', '/sessions');

    cy.contains('Rentals available').should('be.visible');
    cy.contains('Create').should('be.visible');
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
      cy.contains('Edit').should('be.visible');
    });
  });

  it('Shows list of sessions for non admin users', () => {
    cy.visit('/login');

    cy.intercept('POST', '/api/auth/login', {
      body: {
        id: 2,
        username: 'test@test.com',
        firstName: 'test',
        lastName: 'Test',
        admin: false,
      },
    });

    const sessions = [
      {
        id: 1,
        name: 'premier test',
        description: 'première session créée et éditée',
        date: '2025-09-01 02:00:00',
        teacher_id: 2,
        users: [],
        createdAt: '2025-09-02 17:32:28',
        updatedAt: '2025-09-02 17:32:40',
      },
    ];

    cy.intercept('GET', '/api/session', {
      body: sessions,
    });

    cy.get('input[formControlName=email]').type('toto3@toto.com');
    cy.get('input[formControlName=password]').type(
      `${'test!1234'}{enter}{enter}`
    );

    cy.get('.mat-raised-button').should('be.enabled');
    cy.url().should('include', '/sessions');

    cy.contains('Rentals available').should('be.visible');
    cy.contains('Create').should('not.exist');
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
      cy.contains('Edit').should('not.exist');
    });
  });
});

//en cours
