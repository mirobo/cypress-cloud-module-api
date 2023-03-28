describe('intercept issue', () => {
  describe('req.continue()', () => {
    beforeEach(() => {
      cy.intercept({ url: '/delay/*', method: 'GET' }, (req) => {
        req.continue((res) => (res.body['dummy'] = 'some data injected via cypress intercept'));
      }).as('myAlias');

      cy.visit('http://localhost:4200/');
      // the app initially triggers ONE request
      cy.wait('@myAlias');

      // when clicking, the app will trigger two additional requests, and the first will be cancelled because of switchMap
      cy.contains('trigger requests').click();
    });

    it('fails with Error "Socket closed before finished writing response"', () => {
      // the error "socket closed..." is propagated to the cypress test and it fails
      cy.wait('@myAlias');
      cy.contains('Tour of Heroes').should('exist');
    });

    it('does not fail with "Error Socket closed before finished writing response", but should fail', () => {
      // when not waiting on the alias, the error "socket closed.." is ignored, but it appears in the console on the red, cancelled request
      // cy.wait('@myAlias');
      cy.contains('Tour of Heroes').should('exist');
    });
  });

  describe('req.on("response")', () => {
    beforeEach(() => {
      cy.intercept({ url: '/delay/*', method: 'GET' }, (req) => {
        req.on('response', (res) => {
          res.body['dummy'] = 'some data injected via cypress intercept';
        });
      }).as('myAlias');
      cy.visit('http://localhost:4200/');
      cy.wait('@myAlias');
      cy.contains('trigger requests').click();
    });

    it('does not fail with "Error Socket closed before finished writing response", but should fail', () => {
      // the error "socket closed.." is ignored, but it appears in the console on the red, cancelled request
      cy.wait('@myAlias');
      cy.contains('Tour of Heroes').should('exist');
    });

    it('does not fail with "Error Socket closed before finished writing response", but should fail', () => {
      // cy.wait('@myAlias');
      cy.contains('Tour of Heroes').should('exist');
    });
  });
});
