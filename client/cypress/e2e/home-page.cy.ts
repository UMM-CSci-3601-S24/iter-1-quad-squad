import { HomePage } from "cypress/support/home-page.po";

const page = new HomePage();

describe("Home page", () => {
  beforeEach(() => {
    page.navigateTo();
  });

  it('Host button should exist and navigate to the correct page', () => {
    cy.get('button.action-button').contains('Host').should('exist').click();
    cy.url().should('include', '/login');
  });

  it('Hunter button should exist', () => {
    cy.get('button.action-button').contains('Hunter').should('exist').click();
  });
});
