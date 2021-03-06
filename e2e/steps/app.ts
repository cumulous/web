import { $$, link, location, locationOf, navigateTo, steps, Table } from '../support/world';

steps(({Given, When, Then}) => {
  Given(/^I am on the "(.*)" page$/, page =>
    navigateTo(locationOf(page)));

  When(/^I open our app$/, () =>
    navigateTo('/'));

  Then(/^I should see the "(.*)" page$/, page =>
    location().should.become(locationOf(page)));

  Then(/^I should see a tabulated list of .* with columns$/, (table: Table) =>
    $$('.list-column').getText().should.become(table.raw()[0]));

  Then(/^I should be able to navigate using the tabs$/, (tabs: Table) =>
    Promise.all(tabs.raw()[0].map(tab =>
      link(tab).click()
        .then(() => location().should.become(locationOf(tab))))));

  Then(/^the .* should be sorted by date in descending order$/, () => {
    return $$('.column-date').getText().then(dates => {
      dates.length.should.be.above(0);
      const timestamp = date => new Date(date).getTime();
      (dates as any).reduce((last, next) => {
        timestamp(next).should.be.at.most(timestamp(last));
        return next;
      });
    });
  });
});
