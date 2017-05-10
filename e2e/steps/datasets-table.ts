import { StepDefinitions as Steps } from 'cucumber';

export = function() {
  const steps = <Steps>this;

  steps.Given(/^I am on the datasets page$/, () => {
    this.page.navigateTo('/datasets');
  });
  steps.Then(/^I should see the datasets table$/, () => {
    this.page.elementPresent('#datasets-table').should.become(true);
  });
};
