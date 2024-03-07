import { HuntListPage } from "cypress/support/hunt-list.po";

const page = new HuntListPage();

describe("Hunt list", () => {
  before(() => {
    cy.task("seed:database");
  });

  beforeEach(() => {
    page.navigateTo();
  });

  it("Should have a table of hunts", () => {
    page.getHuntTable().should("exist");
  });

/** FIXME: This test is failing no functionality on button
  it("Should navigate to the create hunt page", () => {
    page.clickCreateHunt();
    cy.url().should("include", "/host/create");
  });
*/

// it("Should navigate to the hunt details page", () => {
//   page.getHuntTable().find("tr").eq(2).find("button.action-button").first().next().next().click();
//   cy.url().should("include", "/tasks");
// });
});
