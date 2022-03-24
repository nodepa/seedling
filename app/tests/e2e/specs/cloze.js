const app = '[data-test="app"]';
const loader = '[data-test="loader"]';
const getInstructionComponent = '[data-test="instruction-explainer-component"]';
const continueButton = '[data-test="continue-button"]';
const sentenceCard = '[data-test="sentence-card"]';
const sentenceBlank = '[data-test="sentence-word-3"]';
const successColor = 'rgb(0, 150, 136)';

describe('马丽 interacts with the "cloze" system', () => {
  beforeEach(() => {
    // Avoid dealing with "instruction explainer" side effects.
    localStorage.setItem('InstructionExplainerShownCount', 5);
  });

  it(
    'Displays the single-cloze screen with ' +
      'a sentence with a blank for a missing word and 4 "word" cards',
    () => {
      // *****
      // * 1 *
      // *****
      cy.log('**1. 马丽 sees a sentence with a blank for a missing word**,');
      cy.log('-- sees a list of words from the same lesson,');
      cy.log('&nbsp;&nbsp; of which 1 word is the missing word, and');
      cy.log('-- sees 3 words that are unsuitable substitutes.');
      cy.visit('/lesson/single-cloze-test', {
        onBeforeLoad(window) {
          cy.spy(window.HTMLMediaElement.prototype, 'play').as('audio.play');
          cy.spy(window.Animation.prototype, 'play').as('animation.play');
          cy.spy(window.HTMLElement.prototype, 'animate').as(
            'animation.animate',
          );
          cy.stub(window, 'matchMedia', () => {
            return {
              matches: false,
              addEventListener() {
                /**/
              },
            };
          });
        },
      });
      cy.get(loader).should('not.be.visible');
      cy.get(app).should('be.visible');
      cy.get(getInstructionComponent).should('not.exist');
      // Expected test-data:
      // 0: option1 术
      // 1: option2 两 (correct option)
      // 2: option3 二
      // 3: option4 五减二
      cy.get('[data-test="option-button-1"]')
        .as('option1')
        .should('be.visible')
        .contains('术');
      cy.get('[data-test="option-button-2"]')
        .as('option2')
        .should('be.visible')
        .contains('两');
      cy.get('[data-test="option-button-3"]')
        .as('option3')
        .should('be.visible')
        .contains('二');
      cy.get('[data-test="option-button-4"]')
        .as('option4')
        .should('be.visible')
        .contains('五减二');
      cy.get(sentenceCard)
        .should('be.visible')
        .contains('我有个弟弟，不过没有别的兄弟姐妹。');
      cy.get(continueButton).should('not.exist');

      // *****
      // * 2 *
      // *****
      cy.log('**2. 马丽 taps an incorrect word**, and');
      cy.log('-- sees the word turn red, buzz and become inactive.');
      cy.get('@audio.play').should('have.callCount', 0);
      cy.get('@animation.play').should('have.callCount', 0);
      cy.get('@animation.animate').should('have.callCount', 0);
      cy.get('@option1')
        .click()
        .wait(20)
        .should('have.class', 'ion-color-danger');
      cy.get('@option1').should('have.class', 'button-disabled');

      // 1 item audio played
      cy.get('@audio.play').should('have.callCount', 1);
      cy.get('@audio.play').invoke('resetHistory');
      // 2 audio ripples played
      cy.get('@animation.play').should('have.callCount', 2);
      cy.get('@animation.play').invoke('resetHistory');
      // 2 audio ripples created + 1 button buzz
      cy.get('@animation.animate').should('have.callCount', 3);
      cy.get('@animation.animate').invoke('resetHistory');

      // *****
      // * 3 *
      // *****
      cy.log('**3. 马丽 taps the correct word**,');
      cy.log('-- sees the blank space reveal the correct character,');
      cy.log('&nbsp;&nbsp; on a green background');
      cy.log('-- sees all selectable options become disabled, and');
      cy.log('-- sees the continue button become visible.');
      cy.get('@option2')
        .click()
        .should('have.class', 'ion-color-success')
        .should('not.have.class', 'button-disabled');
      cy.get(sentenceCard).contains('我有两个弟弟，不过没有别的兄弟姐妹。');
      cy.get(sentenceBlank).should(
        'have.css',
        'background-color',
        successColor,
      );
      cy.get('@option1').should('have.class', 'button-disabled');
      cy.get('@option3').should('have.class', 'button-disabled');
      cy.get('@option4').should('have.class', 'button-disabled');
      cy.get(continueButton).should('be.visible');

      // 1 item audio plays
      cy.get('@audio.play').should('have.callCount', 1);
      cy.get('@audio.play').invoke('resetHistory');
      // 2 audio ripples played + 1 continue pulse
      cy.get('@animation.play').should('have.callCount', 3);
      cy.get('@animation.play').invoke('resetHistory');
      // 2 audio ripples created + 1 continue pulse, 0 buzz
      cy.get('@animation.animate').should('have.callCount', 3);
      cy.get('@animation.animate').invoke('resetHistory');
    },
  );

  it(
    'Displays the multi-cloze screen with ' +
      'a sentence with four blanks for missing words and 4 "word" cards',
    () => {
      cy.log('Test sentence: 我[有][两]个弟弟，不过[没有]别的[兄弟姐妹]。');

      // *****
      // * 1 *
      // *****
      cy.log('**1. 马丽 sees a sentence with four blanks for missing words**,');
      cy.log(
        '-- sees a "list" of words matching the number of blanks in the sentence.',
      );
      cy.visit('/lesson/multi-cloze-test', {
        onBeforeLoad(window) {
          cy.spy(window.HTMLMediaElement.prototype, 'play').as('audio.play');
          cy.spy(window.Animation.prototype, 'play').as('animation.play');
          cy.spy(window.HTMLElement.prototype, 'animate').as(
            'animation.animate',
          );
          cy.stub(window, 'matchMedia', () => {
            return {
              matches: false,
              addEventListener() {
                /**/
              },
            };
          });
        },
      });
      cy.get(loader).should('not.be.visible');
      cy.get(app).should('be.visible');
      cy.get(getInstructionComponent).should('not.exist');
      // Expected test-data:
      // 0: option1 兄弟姐妹
      // 1: option2 两
      // 2: option3 没有
      // 3: option4 有
      cy.get('[data-test="option-button-1"]')
        .as('option1')
        .should('be.visible')
        .contains('兄弟姐妹');
      cy.get('[data-test="option-button-2"]')
        .as('option2')
        .should('be.visible')
        .contains('两');
      cy.get('[data-test="option-button-3"]')
        .as('option3')
        .should('be.visible')
        .contains('没有');
      cy.get('[data-test="option-button-4"]')
        .as('option4')
        .should('be.visible')
        .contains('有');
      cy.get(sentenceCard)
        .should('be.visible')
        .contains('我个弟弟，不过别的。');
      cy.get(continueButton).should('not.exist');

      // *****
      // * 2 *
      // *****
      cy.log('**2. 马丽 does not hear auto-played audio of the sentence**,');

      // 1 item audio plays
      cy.get('@audio.play').should('have.callCount', 0);
      // 0 audio ripples played, 0 buzz
      cy.get('@animation.play').should('have.callCount', 0);
      // 0 audio ripples played, 0 buzz
      cy.get('@animation.animate').should('have.callCount', 0);

      // *****
      // * 3 *
      // *****
      cy.log(
        '**3. 马丽 taps the *incorrect* option for the first blank**, and',
      );
      cy.log('-- sees the word turn red and buzz');
      cy.log("-- hears the word's audio");
      cy.log('-- sees the word return to original state.');
      cy.get('@option1').then(($el) => {
        cy.wrap($el[0].attributes['color'].value).should('equal', 'primary');
      });
      cy.get('@option1')
        .click()
        .wait(20)
        .should('have.class', 'ion-color-danger')
        .then(($el) => {
          cy.wrap($el[0].attributes['color'].value).should('equal', 'danger');
        });

      // item returns to normal
      cy.get('@option1')
        .should('not.have.class', 'button-disabled')
        .should('not.have.class', 'ion-color-danger')
        .should('have.class', 'ion-color-primary');

      // 1 audio played
      cy.get('@audio.play').should('have.callCount', 1);
      cy.get('@audio.play').invoke('resetHistory');
      // 2 audio ripples played
      cy.get('@animation.play').should('have.callCount', 2);
      cy.get('@animation.play').invoke('resetHistory');
      // 2 audio ripples created + 1 buzz
      cy.get('@animation.animate').should('have.callCount', 3);
      cy.get('@animation.animate').invoke('resetHistory');

      // *****
      // * 4 *
      // *****
      cy.log('**4. 马丽 taps a *correct* option for the first blank**, and');
      cy.log('-- sees the word button become disabled (no buzz)');
      cy.log(
        '-- sees the first blank in the sentence reveal the word in green',
      );
      cy.log("-- hears the word's audio");
      cy.get('@option4')
        .click()
        .wait(20)
        .should('have.class', 'button-disabled');
      cy.get('[data-test="sentence-word-2"]')
        .should('have.css', 'background-color', successColor)
        .contains('有');

      // 1 audio played
      cy.get('@audio.play').should('have.callCount', 1);
      cy.get('@audio.play').invoke('resetHistory');
      // 2 audio ripples played
      cy.get('@animation.play').should('have.callCount', 2);
      cy.get('@animation.play').invoke('resetHistory');
      // 2 audio ripples created + 0 buzz
      cy.get('@animation.animate').should('have.callCount', 2);
      cy.get('@animation.animate').invoke('resetHistory');

      // *****
      // * 5 *
      // *****
      cy.log('Test sentence: 我[有][两]个弟弟，不过[没有]别的[兄弟姐妹]。');
      cy.log('**5. 马丽 taps elements of the sentence**');
      cy.log("-- hears a non-blank word's audio");
      cy.log("-- hears a revealed blank-word's audio");
      cy.log("-- hears a unrevealed blank's corresponding audio");
      cy.log('-- hears no audio for punctuation');

      // non-blank word
      cy.get('[data-test="sentence-word-1"]')
        .should('have.css', 'background-color', 'rgba(0, 0, 0, 0)')
        .contains('我');
      cy.get('[data-test="sentence-word-1"]').click();
      // 1 audio played
      cy.get('@audio.play').should('have.callCount', 1);
      cy.get('@audio.play').invoke('resetHistory');
      // 2 audio ripples played
      cy.get('@animation.play').should('have.callCount', 2);
      cy.get('@animation.play').invoke('resetHistory');
      // 2 audio ripples created + 0 buzz
      cy.get('@animation.animate').should('have.callCount', 2);
      cy.get('@animation.animate').invoke('resetHistory');

      // revealed blank-word
      cy.get('[data-test="sentence-word-2"]')
        .should('have.css', 'background-color', successColor)
        .contains('有')
        .click();
      // 1 audio played
      cy.get('@audio.play').should('have.callCount', 1);
      cy.get('@audio.play').invoke('resetHistory');
      // 2 audio ripples played
      cy.get('@animation.play').should('have.callCount', 2);
      cy.get('@animation.play').invoke('resetHistory');
      // 2 audio ripples created + 0 buzz
      cy.get('@animation.animate').should('have.callCount', 2);
      cy.get('@animation.animate').invoke('resetHistory');

      // unrevealed blank plays no audio until revealed
      cy.get('[data-test="sentence-word-3"]')
        .should('have.css', 'background-color', 'rgba(0, 0, 0, 0)')
        .should('not.contain', '两')
        .click();
      // 0 audio played
      cy.get('@audio.play').should('have.callCount', 0);
      // 0 audio ripples played
      cy.get('@animation.play').should('have.callCount', 0);
      // 0 audio ripples created + 0 buzz
      cy.get('@animation.animate').should('have.callCount', 0);

      // no audio for punctuation
      cy.get('[data-test="sentence-word-5"]').should(
        'have.css',
        'background-color',
        'rgba(0, 0, 0, 0)',
      );
      cy.get('[data-test="sentence-word-5-punctuation"]')
        .contains('，')
        .click()
        .should('not.contain', '.ripple');
      // 0 audio played
      cy.get('@audio.play').should('have.callCount', 0);
      // 0 audio ripples played
      cy.get('@animation.play').should('have.callCount', 0);
      // 0 audio ripples created + 0 buzz
      cy.get('@animation.animate').should('have.callCount', 0);

      // *****
      // * 6 *
      // *****
      cy.log('**6. 马丽 taps the *correct* option for the second blank**, and');
      cy.log('-- sees the word button become disabled (no buzz)');
      cy.log(
        '-- sees the first blank in the sentence reveal the word in green',
      );
      cy.log("-- hears the word's audio");

      cy.get('[data-test="sentence-word-3"]')
        .should('have.css', 'background-color', 'rgba(0, 0, 0, 0)')
        .should('not.contain', '两');
      cy.get('@option2')
        .click()
        .wait(20)
        .should('have.class', 'button-disabled');

      cy.get('[data-test="sentence-word-3"]')
        .should('have.css', 'background-color', successColor)
        .should('contain', '两');
      // 1 audio played
      cy.get('@audio.play').should('have.callCount', 1);
      cy.get('@audio.play').invoke('resetHistory');
      // 2 audio ripples played
      cy.get('@animation.play').should('have.callCount', 2);
      cy.get('@animation.play').invoke('resetHistory');
      // 2 audio ripples created + 0 buzz
      cy.get('@animation.animate').should('have.callCount', 2);
      cy.get('@animation.animate').invoke('resetHistory');

      // *****
      // * 7 *
      // *****
      cy.log('**7. 马丽 taps the *correct* option for the third blank**, and');
      cy.log('-- sees the word button become disabled (no buzz)');
      cy.log(
        '-- sees the first blank in the sentence reveal the word in green',
      );
      cy.log("-- hears the word's audio");

      cy.get('[data-test="sentence-word-8"]')
        .should('have.css', 'background-color', 'rgba(0, 0, 0, 0)')
        .should('not.contain', '没有');
      cy.get('@option3')
        .click()
        .wait(20)
        .should('have.class', 'button-disabled');
      cy.get('[data-test="sentence-word-8"]')
        .should('have.css', 'background-color', successColor)
        .should('contain', '没有');

      // 1 audio played
      cy.get('@audio.play').should('have.callCount', 1);
      cy.get('@audio.play').invoke('resetHistory');
      // 2 audio ripples played
      cy.get('@animation.play').should('have.callCount', 2);
      cy.get('@animation.play').invoke('resetHistory');
      // 2 audio ripples created + 0 buzz
      cy.get('@animation.animate').should('have.callCount', 2);
      cy.get('@animation.animate').invoke('resetHistory');

      // *****
      // * 8 *
      // *****
      cy.log('**8. 马丽 taps the *correct* option for the last blank**, and');
      cy.log('-- sees the word button become disabled (no buzz)');
      cy.log('-- sees the last blank in the sentence reveal the word in green');
      cy.log("-- hears the word's audio");
      cy.log('-- sees the continue button visible and flashing');

      cy.get('[data-test="sentence-word-10"]')
        .should('have.css', 'background-color', 'rgba(0, 0, 0, 0)')
        .should('not.contain', '兄弟姐妹');
      cy.get('@option1')
        .click()
        .wait(20)
        .should('have.class', 'button-disabled');
      cy.get('[data-test="sentence-word-10"]')
        .should('have.css', 'background-color', successColor)
        .should('contain', '兄弟姐妹');
      cy.get(continueButton).should('be.visible');

      // 1 audio played
      cy.get('@audio.play').should('have.callCount', 1);
      cy.get('@audio.play').invoke('resetHistory');
      // 2 audio ripples played + 1 continue pulse
      cy.get('@animation.play').should('have.callCount', 3);
      cy.get('@animation.play').invoke('resetHistory');
      // 2 audio ripples created + 0 buzz + 1 continue pulse
      cy.get('@animation.animate').should('have.callCount', 3);
      cy.get('@animation.animate').invoke('resetHistory');
    },
  );
});
