describe(
  'test',
  {
    requestTimeout: 10000,
    responseTimeout: 20000,
  },
  () => {
    xit('abort request', () => {
      cy.intercept({ url: '/delay/*', method: 'GET' }, (req) => {
        req.continue((res) => (res.body['dummy'] = 'some data injected via cypress intercept'));
      }).as('myAlias');
      cy.visit('/cypress/fixtures/abort-request-xmlhttprequest.html');

      cy.wait('@myAlias');
      cy.contains('Begin1').click();

      cy.wait('@myAlias');

      cy.contains('Example of fetch abort').should('exist');
    });
  }
);
