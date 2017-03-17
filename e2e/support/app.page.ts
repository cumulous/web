import { browser, element, by } from 'protractor';

export class AppPage {
  navigateTo(location: string) {
    return browser.get(location);
  }

  elementText(selector: string) {
    return element(by.css(selector)).getText();
  }
}
