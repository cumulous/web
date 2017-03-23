import { StepDefinitions as Steps } from 'cucumber';

export = function() {
  const steps = <Steps>this;

  steps.Given(/^I am on the projects page$/, () => {
    return 'pending';
  });
  steps.Then(/^I should see the projects table header$/, () => {
    return 'pending';
  });
};
