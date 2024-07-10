
describe('intercept issue', () => {

  describe('verify number of API calls when two interceptions are set up', () => {

    it('req.continue() with res.send()', () => {
      cy.intercept({ url: '/delay/*', method: 'GET' }, (req) => {
        req.continue((res) => {
          res.send(200, { ...res.body, dummy: 'some data injected via cypress intercept' });
        });
      }).as('myAlias');
      cy.intercept({ url: '/delay/*', method: 'GET' }, (req) => {
        req.continue((res) => {
          res.send(200, { ...res.body, dummy: 'some data injected via cypress intercept' });
        });
      }).as('myAlias');
      cy.visit('http://localhost:4200/');
      cy.wait('@myAlias');
      cy.contains('trigger requests').click();

      cy.contains('counter: 3')
      cy.get('@myAlias.all').should('have.length', 3)
    })

    it('req.on("before:response")', () => {
      cy.intercept({ url: '/delay/*', method: 'GET' }, (req) => {
        req.on('before:response', (res) => {
          res.send(200, { ...res.body, dummy: 'some data injected via cypress intercept' });
        });
      }).as('myAlias');
      cy.intercept({ url: '/delay/*', method: 'GET' }, (req) => {
        req.on('before:response', (res) => {
          res.send(200, { ...res.body, dummy: 'some data injected via cypress intercept' });
        });
      }).as('myAlias');
      cy.visit('http://localhost:4200/');
      cy.wait('@myAlias');
      cy.contains('trigger requests').click();

      cy.contains('counter: 3')
      cy.get('@myAlias.all').should('have.length', 3)
    })


  })

  describe('req.on("before:response")', () => {
    beforeEach(() => {
      cy.intercept({ url: '/delay/*', method: 'GET' }, (req) => {
        req.on('before:response', (res) => {
          res.send(200, { ...res.body, dummy: 'some data injected via cypress intercept' });
        });
      }).as('myAlias');
      cy.intercept({ url: '/delay/*', method: 'GET' }, (req) => {
        req.on('before:response', (res) => {
          res.send(200, { ...res.body, dummy: 'some data injected via cypress intercept' });
        });
      }).as('myAlias');
      cy.visit('http://localhost:4200/');
      cy.wait('@myAlias');
      cy.contains('trigger requests').click();
    });

    it('does not fail with "Error Socket closed before finished writing response", but should fail', () => {
      // the error "socket closed.." is ignored, but it appears in the console on the red, cancelled request
      cy.wait('@myAlias')
      verifyThatSecondCallIsWaitedFor();
      cy.contains('Tour of Heroes').should('exist');
    });

    xit('does not fail with "Error Socket closed before finished writing response", but should fail', () => {
      // cy.wait('@myAlias');
      cy.contains('Tour of Heroes').should('exist');
      cy.wait(1000)
    });
  });

  describe('req.continue() with res.send()', () => {
    beforeEach(() => {
      cy.intercept({ url: '/delay/*', method: 'GET' }, (req) => {
        req.continue((res) => {
          res.send(200, { ...res.body, dummy: 'some data injected via cypress intercept' });
        });
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
      verifyThatSecondCallIsWaitedFor();
      cy.contains('Tour of Heroes').should('exist');
      cy.wait(1000)

    });

    it('does not fail with "Error Socket closed before finished writing response", but should fail', () => {
      // when not waiting on the alias, the error "socket closed.." is ignored, but it appears in the console on the red, cancelled request
      cy.contains('Tour of Heroes').should('exist');
      cy.wait(1000)
    });
  });


  xdescribe('req.on("response")', () => {
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
      verifyThatSecondCallIsWaitedFor();
      cy.contains('Tour of Heroes').should('exist');
    });

    it('does not fail with "Error Socket closed before finished writing response", but should fail', () => {
      // cy.wait('@myAlias');
      cy.contains('Tour of Heroes').should('exist');
      cy.wait(1000)
    });
  });

  xdescribe('req.continue() with overwriting body', () => {
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
      verifyThatSecondCallIsWaitedFor();
      cy.contains('Tour of Heroes').should('exist');
    });

    it('does not fail with "Error Socket closed before finished writing response", but should fail', () => {
      // when not waiting on the alias, the error "socket closed.." is ignored, but it appears in the console on the red, cancelled request
      cy.contains('Tour of Heroes').should('exist');
      cy.wait(1000)
    });
  });


});


function verifyThatSecondCallIsWaitedFor() {
  cy.get('@myAlias').then((ic) => {
    expect(ic.request.query['param']).to.equal('call2')
  });

}