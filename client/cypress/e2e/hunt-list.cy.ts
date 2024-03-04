import { HuntListPage } from "cypress/support/hunt-list.po";

const page = new HuntListPage();

describe("Hunt list", () => {
  before(() => {
    cy.task("seed:database");
  });

  beforeEach(() => {
    page.navigateTo();
  });
});
