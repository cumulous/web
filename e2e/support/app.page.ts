import { browser, element, by } from 'protractor';

export class AppPage {
  navigateTo(location: string) {
    return browser.get(location);
  }

  private getElement(selector: string) {
    return element(by.css(selector));
  }

  elementText(selector: string) {
    return this.getElement(selector).getText();
  }

  elementPresent(selector: string) {
    return this.getElement(selector).isPresent();
  }

  location() {
    return browser.getCurrentUrl()
      .then(url => '/'.concat(url.split('/').slice(3).join('/')));
  }
}
