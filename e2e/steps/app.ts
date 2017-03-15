import { StepDefinitions as Steps } from 'cucumber';

export = function() {
	const steps = <Steps>this;

  steps.Given(/^I am on the app page$/, () => {
    this.page.navigateTo('/');
  });
  steps.Then(/^I should see a message saying that the app works$/, () => {
    this.page.elementText('app-root h1').should.become('app works!');
  });
};
