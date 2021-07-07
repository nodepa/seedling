describe('马丽 opens the app to lessons overview', () => {
  it(
    'Displays splash animation, ' +
      'then "get introductions" graphic, ' +
      'then lessons list',
    () => {
      cy.log(
        '马丽 picks up her phone and taps on a link in her messaging app. The Literacy App Prototype opens and displays a screen with an animation that encourages 马丽 to wait for the web app to get ready.',
      );
      cy.visit('/', {
        onBeforeLoad(window) {
          cy.spy(window.HTMLMediaElement.prototype, 'play').as('audio.play');
          cy.spy(window.Animation.prototype, 'play').as('animation.play');
          cy.spy(window.Animation.prototype, 'cancel').as('animation.cancel');
        },
      });
      cy.get('[data-test="app"]').should('not.exist'); // gets visible fast
      cy.get('[data-test="loader"]').should('be.visible'); // gets hidden fast
      cy.get('@animation.cancel').should('have.callCount', 0); // not called yet
      cy.get('@audio.play').should('have.callCount', 0); // not called yet
      cy.get('@animation.play').should('have.callCount', 0); // not called yet

      cy.log(
        'Once the web app is ready, a screen with an animation indicating the expectation that 马丽 should tap an interactive icon is displayed. The icon is re-used on every screen in the app and has a symbol that indicates “listen”, “help”, “instructions” or “support”.',
      );
      cy.get('[data-test="loader"]').should('not.be.visible');
      cy.get('[data-test="app"]')
        .should('exist')
        .find('[data-test="get-instructions-component"]')
        .should('be.visible');
      cy.get('[data-test="home-button"]').should(
        'have.class',
        'v-btn--disabled', // vuetify-disabled
      );

      // ###############
      // ### pending ###
      // ###############
      // cy.log('The "instructions" icon vibrates periodically to invite interaction.');
      // cy.get('[data-test="toggle-instructions-button"]')
      //   .should('be.visible')
      //   .then(($el) => {
      //     // .getAnimations() is only available from Chromium 79
      //     // Awaiting update of cli-plugin-e2e-cypress > cypress > electron
      //     console.dir($el[0].getAnimations);
      //   });

      cy.log(
        'A short auto-played audio clip invites 马丽 to tap the interactive icon.',
      );
      cy.wait(200);
      cy.get('[data-test="get-instructions-component"]')
        .find('audio')
        .then(($el) => {
          return expect($el[0].paused).to.be.false; // = playing
        });

      cy.log(
        'When 马丽 taps the icon, an instructions overlay is displayed over the Home screen',
      );
      cy.get('[data-test="instructions-overlay"]').should('not.exist');
      cy.get('[data-test="toggle-instructions-button"]')
        .should('be.visible')
        .click();
      cy.get('[data-test="get-instructions-component"]').should(
        'not.be.visible',
      );
      cy.get('[data-test="home-button"]').should(
        'not.have.class',
        'v-btn--disabled', // vuetify-disabled
      );
      cy.get('[data-test="instructions-overlay"]').should('exist');
      cy.get('[data-test="lessons-list"]').should('be.visible');

      cy.log(
        'An audio clip plays explaining how tapping the icon is the way to get help or instructions throughout the web app, encouraging 马丽 to tap one of the buttons to try out the “instructions” mode.',
      );
      cy.get('[data-test="toggle-instructions-button"]')
        .find('audio')
        .then(($el) => {
          return expect($el[0].paused).to.be.false; // = playing
        });

      cy.log(
        '马丽 taps one of the buttons with an instruction, the instruction is played and the web app’s dashboard is displayed when done.',
      );
      cy.get('[data-test="home-button"]')
        .click()
        .find('audio')
        .then(($el) => {
          return expect($el[0].paused).to.be.false; // = playing
        })
        // Should auto-hide overlay after audio finishes
        // Waits for audio to finish if less than 5 sec. Time consuming
        .then(() => {
          cy.wait(2000);
          cy.get('[data-test="instructions-overlay"]').should('not.exist');
        });
    },
  );
});