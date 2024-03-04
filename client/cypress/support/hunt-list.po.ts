export class HuntListPage {
  private readonly baseUrl = '/host';
  private readonly huntTable = '.hunt-table';
  private readonly createHuntButton = '[create-button]';

  navigateTo() {
    return cy.visit(this.baseUrl);
  }

  getHuntTable() {
    return cy.get(this.huntTable);
  }
}
