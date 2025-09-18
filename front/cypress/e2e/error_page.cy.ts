/// <reference types="cypress" />
import 'cypress-mochawesome-reporter/register';

describe('error page', () => {
  it('Should show the 404 page when the page does not exist', () => {
    cy.visit('/falseId');
    cy.get('h1').should('contain', 'Page not found !');
  });
});
