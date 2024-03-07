export class HomePage {
  private readonly baseUrl = '/';


  navigateTo() {
    return cy.visit(this.baseUrl);
  }






}
