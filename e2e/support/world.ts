import * as chai from 'chai';
import * as chaiAsPromised from 'chai-as-promised';
import { defineSupportCode as hooks } from 'cucumber';
import { $, browser } from 'protractor';

export { defineSupportCode as steps } from 'cucumber';
export { $ } from 'protractor';

hooks(({Before}) => {
  Before(() => {
    chai.use(chaiAsPromised).should();
  });
});

export const navigateTo = location =>
  browser.get(location);

export const locationOf = page =>
    `/${page.toLowerCase()}`;

export const location = () =>
  browser.getCurrentUrl()
    .then(url => '/'.concat(url
      .split('/')
      .slice(3)
      .join('/')
    ));