import { StepDefinitions as Steps } from 'cucumber';

export = function() {
  const steps = <Steps>this;

  steps.Then(/^We should see a column with name (.*)$/, (name: string) => {
     this.page.elementText('.datasets-table-column-name').should.become(name);
  });

  steps.Then(/^I should see 3 unique columns $/, () => {
    // this.page.elementText('.datasets-table-column-name').column().count().should.equal(3);
    return 'pending';
  });

  steps.Then(/^I should be able to sort by each column $/, () => {
    return 'pending';
  });

};
