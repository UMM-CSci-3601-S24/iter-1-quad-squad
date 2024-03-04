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

  it("Should show 2 hunts (3 table rows)", () => {
    page.getHuntTable().find("tr").should("have.length", 3);
  });

});
