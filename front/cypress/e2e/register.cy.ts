/// <reference types="cypress" />
import 'cypress-mochawesome-reporter/register';

describe('Register spec', () => {
  it('should register successful', () => {
    cy.visit('/register');

    cy.intercept('POST', '/api/auth/register', {
      body: {
        firstName: 'firstName',
        lastName: 'lastName',
        email: 'yoga@studio.com',
        password: 'password',
      },
    });

    cy.intercept(
      {
        method: 'GET',
        url: '/api/session',
      },
      []
    ).as('session');

    const firstName: string = 'firstName';
    const lastName: string = 'lastName';
    const email: string = 'yoga@studio.com';
    const password: string = 'password';

    cy.get('input[formControlName=firstName]').type(firstName);
    cy.get('input[formControlName=lastName]').type(lastName);
    cy.get('input[formControlName=email]').type(email);
    cy.get('input[formControlName=password]').type(password);
    cy.get('.register-form > .mat-focus-indicator').should('be.enabled');
    cy.get('.register-form > .mat-focus-indicator').click();
    cy.url().should('include', '/login');
  });

  it('should failed to register with invalid fields', () => {
    cy.visit('/register');
    cy.intercept('POST', '/api/auth/register', {
      body: 'Bad request',
      statusCode: 400,
    });

    const firstName: string = 'a';
    const lastName: string = 'a';
    const email: string = 'a@a';
    const password: string = 'a';

    cy.get('input[formControlName=firstName]').type(firstName);
    cy.get('input[formControlName=lastName]').type(lastName);
    cy.get('input[formControlName=email]').type(email);
    cy.get('input[formControlName=password]').type(password);
    cy.get('.register-form > .mat-focus-indicator').click();
    cy.url().should('not.include', '/login');
    cy.contains('An error occurred').should('be.visible');
  });
});

//en cours
