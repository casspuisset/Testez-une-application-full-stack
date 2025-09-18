/// <reference types="cypress" />
import 'cypress-mochawesome-reporter/register';

describe('Me spec', () => {
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
  it('Shows admin user informations', () => {
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

    cy.get('input[formControlName=email]').type('yoga@studio.com');
    cy.get('input[formControlName=password]').type(
      `${'test!12345'}{enter}{enter}`
    );

    cy.url().should('include', '/sessions');

    const userInfo = {
      id: 1,
      email: 'yoga@studio.com',
      lastName: 'Admin',
      firstName: 'Admin',
      admin: true,
      createdAt: '2025-09-01 19:34:14',
      updatedAt: '2025-09-01 19:34:14',
    };

    cy.intercept('GET', '/api/user/1', userInfo);

    cy.get('[routerlink="me"]').click();

    const createdAtYear = userInfo.createdAt.slice(0, 10).split('-')[0];
    const updatedAtYear = userInfo.updatedAt.slice(0, 10).split('-')[0];
    const createdAtMonth =
      months[Number(userInfo.createdAt.slice(0, 10).split('-')[1]) - 1];
    const updatedAtMonth =
      months[Number(userInfo.updatedAt.slice(0, 10).split('-')[1]) - 1];
    const createdAtDay = Number(userInfo.createdAt.slice(0, 10).split('-')[2]);
    const updatedAtDay = Number(userInfo.updatedAt.slice(0, 10).split('-')[2]);

    cy.contains(
      `${userInfo.firstName} ${userInfo.lastName.toUpperCase()}`
    ).should('be.visible');
    cy.contains(userInfo.email).should('be.visible');
    cy.contains(userInfo.admin ? 'You are admin' : '').should('be.visible');
    cy.contains(`${createdAtMonth} ${createdAtDay}, ${createdAtYear}`).should(
      'be.visible'
    );
    cy.contains(`${updatedAtMonth} ${updatedAtDay}, ${updatedAtYear}`).should(
      'be.visible'
    );
  });

  it('Shows non admin user informations', () => {
    cy.visit('/login');
    cy.intercept('POST', '/api/auth/login', {
      body: {
        id: 3,
        username: 'toto@toto.com',
        firstName: 'toto',
        lastName: 'toto',
        admin: false,
      },
    });

    cy.get('input[formControlName=email]').type('test@test.com');
    cy.get('input[formControlName=password]').type(
      `${'test!1234'}{enter}{enter}`
    );

    cy.url().should('include', '/sessions');

    const userInfo = {
      id: 3,
      lastName: 'toto',
      firstName: 'toto',
      admin: false,
      email: 'toto3@toto.com',
      createdAt: '2025-09-15 18:57:21',
      updatedAt: '2025-09-15 18:57:21',
    };

    cy.intercept('GET', '/api/user/3', userInfo);

    cy.get('[routerlink="me"]').click();

    const createdAtYear = userInfo.createdAt.slice(0, 10).split('-')[0];
    const updatedAtYear = userInfo.updatedAt.slice(0, 10).split('-')[0];
    const createdAtMonth =
      months[Number(userInfo.createdAt.slice(0, 10).split('-')[1]) - 1];
    const updatedAtMonth =
      months[Number(userInfo.updatedAt.slice(0, 10).split('-')[1]) - 1];
    const createdAtDay = Number(userInfo.createdAt.slice(0, 10).split('-')[2]);
    const updatedAtDay = Number(userInfo.updatedAt.slice(0, 10).split('-')[2]);

    cy.contains(
      `${userInfo.firstName} ${userInfo.lastName.toUpperCase()}`
    ).should('be.visible');
    cy.contains(userInfo.email).should('be.visible');
    cy.contains(userInfo.admin ? 'You are admin' : 'Delete my account:').should(
      'be.visible'
    );
    cy.contains(`${createdAtMonth} ${createdAtDay}, ${createdAtYear}`).should(
      'be.visible'
    );
    cy.contains(`${updatedAtMonth} ${updatedAtDay}, ${updatedAtYear}`).should(
      'be.visible'
    );

    cy.get('button.mat-raised-button').should('be.visible');
    cy.get(
      '.my2 > .mat-focus-indicator > .mat-button-wrapper > .mat-icon'
    ).should('contain', 'delete');
    cy.get('.ml1').should('contain', 'Detail');
  });
});

//en cours
