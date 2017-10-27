import * as chai from 'chai';
import * as chaiAsPromised from 'chai-as-promised';
import { defineSupportCode as hooks } from 'cucumber';
import { createWriteStream, readFileSync } from 'fs';
import { parse } from 'ini';
import { $, browser, by, element } from 'protractor';
import { post } from 'request-promise-native';

export { defineSupportCode as steps, TableDefinition as Table } from 'cucumber';
export { $, $$ } from 'protractor';

const authConfig = parse(readFileSync('tmp/.auth.conf', 'utf-8'));

let token: string;

const fetchToken = () => {
  return post(authConfig.url, {
    headers: {
      Authorization: authConfig.header.split(/ (Basic .*)/)[1],
    },
    form: {
      grant_type: 'client_credentials',
    },
    json: true,
  }).then(data => token = data.access_token);
};

const login = accessToken =>
  browser.get(`/login#access_token=${accessToken}`);

const authorize = () =>
  token ? login(token) : fetchToken().then(login);

hooks(({Before}) => {
  Before(() => {
    chai.use(chaiAsPromised).should();
    return authorize();
  });
});

export const navigateTo = url =>
  browser.get(url);

export const locationOf = page =>
    `/${page.toLowerCase()}`;

export const location = () =>
  browser.getCurrentUrl()
    .then(url => '/'.concat(url
      .split('/')
      .slice(3)
      .join('/')
    ));

export const link = (text: string) =>
  element(by.linkText(text));

export const elementsWithText = (selector: string, text: string) =>
  element.all(by.cssContainingText(selector, text));

export const waitFor = condition =>
  browser.wait(condition);


const screenshotPrefix = 'tmp/screenshot';

const writeScreenShot = (data: string, index: number) => {
  const stream = createWriteStream(screenshotPrefix + '.' + index + '.png');
  stream.write(new Buffer(data, 'base64'));
  stream.end();
};

export const takeScreenshot = (index: number, scrollTo = 0) =>
  browser.executeScript('window.scrollTo(0, arguments[0]);', scrollTo)
    .then(() => browser.takeScreenshot())
    .then(data => writeScreenShot(data, index));
