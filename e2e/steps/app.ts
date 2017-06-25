import { $, $$, location, locationOf, navigateTo, steps, Table } from '../support/world';

steps(({Given, When, Then}) => {
  Given(/^I am on the "(.*)" page$/, page =>
    navigateTo((locationOf(page))));
  When(/^I open our app$/, () =>
    navigateTo('/'));
  Then(/^I should see a message saying that the app works$/, () =>
    $('app-root h1').getText().should.become('app works!'));
  Then(/^I should see the "(.*)" page$/, page =>
    location().should.become(locationOf(page)));
  Then(/^I should see a tabulated list of .* with columns$/, (table: Table) =>
    $$(`.list-column`).getText().should.become(table.raw()[0]));
});
