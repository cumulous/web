import { StepDefinitions as Steps } from 'cucumber';

export = function() {
  const steps = <Steps>this;

  steps.Then(/^We should see a column with name (.*)$/, (name: string) => {
     this.page.elementText('.datasets-table-column-name').should.become(name);
  });
};
