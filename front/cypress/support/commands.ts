// ***********************************************
// This example namespace declaration will help
// with Intellisense and code completion in your
// IDE or Text Editor.
// ***********************************************
// declare namespace Cypress {
//   interface Chainable<Subject = any> {
//     customCommand(param: any): typeof customCommand;
//   }
// }
//
// function customCommand(param: any): void {
//   console.warn(param);
// }
//
// NOTE: You can use it like so:
// Cypress.Commands.add('customCommand', customCommand);
//
// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add("login", (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add("drag", { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add("dismiss", { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite("visit", (originalFn, url, options) => { ... })

/// <reference types="cypress" />
/// <reference path="../support/index.d.ts"/>
Cypress.Commands.add('login', () => {
  cy.intercept('POST', 'http://localhost:4200/api/auth/login', {
    statusCode: 200,
    body: {
      token:
        'eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJ5b2dhQHN0dWRpby5jb20iLCJpYXQiOjE3NTkxNjA2NTgsImV4cCI6MTc1OTI0NzA1OH0.2vHJiPz-T79TbXFG5oHIl8Lc0aP59hf8tOnymk1y1WRSaFUPytDUXySY-9sXNp9dS32Dm-G7wuvGm9ck6IVODw',
      type: 'Bearer',
      id: 1,
      username: 'yoga@studio.com',
      firstName: 'Admin',
      lastName: 'Admin',
      admin: true,
    },
  }).as('loginRequest');

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

  cy.visit('/login');
  cy.get('input[formControlName=email]').type('yoga@studio.com');
  cy.get('input[formControlName=password]').type('test!1234');
  cy.get('button[type=submit]').click();

  cy.wait('@loginRequest');
});

Cypress.Commands.add('loginNonAdmin', () => {
  cy.intercept('POST', 'http://localhost:4200/api/auth/login', {
    statusCode: 200,
    body: {
      token:
        'eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJ5b2dhQHN0dWRpby5jb20iLCJpYXQiOjE3NTkxNjA2NTgsImV4cCI6MTc1OTI0NzA1OH0.2vHJiPz-T79TbXFG5oHIl8Lc0aP59hf8tOnymk1y1WRSaFUPytDUXySY-9sXNp9dS32Dm-G7wuvGm9ck6IVODw',
      type: 'Bearer',
      id: 2,
      username: 'test@test.com',
      firstName: 'test',
      lastName: 'TEST',
      admin: false,
    },
  }).as('loginRequest');

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

  cy.visit('/login');
  cy.get('input[formControlName=email]').type('test@test.com');
  cy.get('input[formControlName=password]').type('test!1234');
  cy.get('button[type=submit]').click();

  cy.wait('@loginRequest');
});

Cypress.Commands.add('register', () => {
  cy.intercept('POST', 'http://localhost:4200/api/auth/register', {
    statusCode: 200,
    body: {
      message: 'User registered successfully!',
    },
  }).as('loginRequest');

  cy.intercept('GET', 'http://localhost:4200/api/user/1', {
    statusCode: 200,
    body: {
      id: 2,
      email: 'test@test.com',
      lastName: 'TEST',
      firstName: 'Test',
      admin: true,
      createdAt: '2025-09-01 19:34:14',
      updatedAt: '2025-09-01 19:34:14',
    },
  }).as('userInfoRequest');

  cy.visit('/register');
  cy.get('input[formControlName=email]').type('test@test.com');
  cy.get('input[formControlName=firstName]').type('Test');
  cy.get('input[formControlName=lastName]').type('TEST');
  cy.get('input[formControlName=password]').type('password');

  cy.get('button[type=submit]').click();

  cy.wait('@loginRequest');
});

Cypress.Commands.add('getTeachers', () => {
  cy.intercept('GET', 'http://localhost:4200/api/teacher', {
    statusCode: 200,
    body: [
      {
        id: 1,
        lastName: 'DELAHAYE',
        firstName: 'Margot',
        createdAt: '2025-09-01 19:34:13',
        updatedAt: '2025-09-01 19:34:13',
      },
      {
        id: 2,
        lastName: 'THIERCELIN',
        firstName: 'Hélène',
        createdAt: '2025-09-01 19:34:13',
        updatedAt: '2025-09-01 19:34:13',
      },
    ],
  }).as('TeachersRequest');

  return cy.wait('@TeachersRequest');
});
