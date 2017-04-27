import { browser, element, by } from 'protractor';

export class AppPage {
  navigateTo(location: string) {
    return browser.get(location);
  }

  elementText(selector: string) {
    return element(by.css(selector)).getText();
  }

  location() {
    return browser.getCurrentUrl()
      .then(url => '/'.concat(url.split('/').slice(3).join('/')));
  }
}
