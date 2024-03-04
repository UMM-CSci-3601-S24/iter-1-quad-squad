export class HuntListPage {
  private readonly baseUrl = '/host';

navigateTo() {
  return cy.visit(this.baseUrl);
}
}
