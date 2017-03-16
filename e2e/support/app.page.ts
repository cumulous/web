import { browser, element, by } from 'protractor';

export class AppPage {
  navigateTo(location: string) {
    return browser.get(location);
  }

  elementText(selector: string) {
    // console.log(element(by.css(selector)));
    // element(by.css(selector)).getText().then(text => console.log(text));
    // console.log(element(by.css(selector)).getText);
    // console.log(element(by.css(selector)).getText());
    return element(by.css(selector)).getText();
  }
}
