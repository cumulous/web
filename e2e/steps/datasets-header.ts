import { StepDefinitions as Steps } from 'cucumber';

export = function() {
  const steps = <Steps>this;

  steps.Given(/^I am on the datasets page expecting a header$/, () => {
    this.page.navigateTo('/datasets');
  });
  steps.Then(/^I should see the datasets table header$/, () => {
     this.page.elementPresent('app root header').should.become(true);
  });
};
