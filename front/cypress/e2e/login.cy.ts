/// <reference types="cypress" />
import 'cypress-mochawesome-reporter/register';

describe('Login spec', () => {
  const regExp = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

  it('Login successful', () => {
    cy.visit('/login');

    cy.intercept('POST', '/api/auth/login', {
      body: {
        id: 1,
        username: 'userName',
        firstName: 'firstName',
        lastName: 'lastName',
        admin: true,
      },
    });

    cy.intercept(
      {
        method: 'GET',
        url: '/api/session',
      },
      []
    ).as('session');

    const email: string = 'yoga@studio.com';
    const password: string = 'test!12345';

    cy.get('input[formControlName=email]').type(email);
    cy.get('input[formControlName=password]').type(`${password}{enter}{enter}`);

    if (regExp.test(email) && password.length > 3 && password.length < 40) {
      cy.get('.mat-raised-button').should('be.enabled');
      cy.url().should('include', '/sessions');
    } else {
      cy.url().should('not.include', '/sessions');
      cy.contains('An error occurred').should('be.visible');
    }
  });

  it('Login failed, invalid fields', () => {
    cy.visit('/login');

    cy.intercept('POST', '/api/auth/login', {
      body: 'Bad request',
      statusCode: 400,
    });

    const email: string = 'a@a.a';
    const password: string = 'a';

    cy.get('input[formControlName=email]').type(email);
    cy.get('input[formControlName=password]').type(`${password}{enter}{enter}`);

    if (regExp.test(email) && password.length > 3 && password.length < 40) {
      cy.get('.mat-raised-button').should('be.enabled');
      cy.url().should('include', '/sessions');
    } else {
      cy.url().should('not.include', '/sessions');
      cy.contains('An error occurred').should('be.visible');
    }
  });

  it('Login failed, bad credentials', () => {
    cy.visit('/login');

    cy.intercept('POST', '/api/auth/login', {
      body: 'An error occurred',
      statusCode: 400,
    });

    const email: string = 'error@email.com';
    const password: string = 'error_password';

    cy.get('input[formControlName=email]').type(email);
    cy.get('input[formControlName=password]').type(`${password}{enter}{enter}`);

    if (regExp.test(email) && password.length > 3 && password.length < 40) {
      cy.get('.mat-raised-button').should('be.enabled');
      cy.url().should('not.include', '/sessions');
      cy.contains('An error occurred').should('be.visible');
    } else {
      cy.url().should('not.include', '/sessions');
      cy.contains('An error occurred').should('be.visible');
    }
  });
});

//en cours
