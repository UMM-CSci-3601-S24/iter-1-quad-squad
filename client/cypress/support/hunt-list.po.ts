export class HuntListPage {
  private readonly baseUrl = '/host';
  private readonly huntTable = '.hunt-table';
  private readonly createHuntButton = '[data-test=createHuntButton]';

  navigateTo() {
    return cy.visit(this.baseUrl);
  }

  getHuntTable() {
    return cy.get(this.huntTable);
  }

  clickCreateHunt() {
    return cy.get(this.createHuntButton).click();
  }
}
