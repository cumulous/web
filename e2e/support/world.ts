// import { expect } from 'chai';
import * as chai from 'chai';
import * as chaiAsPromised from 'chai-as-promised';
import { Hooks } from 'cucumber';

import { AppPage } from './app.page';

export = function() {
  const hooks = <Hooks>this;

  hooks.Before(() => {
    this.page = new AppPage();
    chai.use(chaiAsPromised).should();
  });
};
