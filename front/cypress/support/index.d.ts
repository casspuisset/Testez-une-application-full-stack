/// <reference types="cypress" />

declare namespace Cypress {
  interface Chainable<Subject = any> {
    login(): Chainable<any>;
    loginNonAdmin(): Chainable<any>;
    register(): Chainable<any>;
    getTeachers(): Chainable<any>;
  }
}
