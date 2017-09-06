import { elementsWithText, steps, waitFor } from '../support/world';

steps(({Then}) => {
  Then(/^I should see the documentation for the API$/, () => {
    return elementsWithText('div', 'Backend API')
      .first().isDisplayed().should.become(true);
  });
  Then(/^I should be able to invoke API methods$/, () => {
    return elementsWithText('div', 'Retrieve the API spec').last().click()
      .then(() => elementsWithText('button', 'Try it out').last().click())
      .then(() => elementsWithText('button', 'Execute').last().click())
      .then(() => waitFor(elementsWithText('div', '"definitions": {').count()));
  });
});
