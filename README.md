# SASSY UI

This project implements a web interface for
the Serverless Application System for Storage and analYsis (SASSY) of scientific data.

It builds upon [Angular 2](https://angular.io/) framework for single-page applications.

## Setting up

### API client

Prior to building the app or running any tests, you need to configure the API client.
To do that on a Linux system, please run `npm run api <YOUR_API_ID> <YOUR_API_STAGE>`,
and specify your AWS API Gateway ID and API Stage
(you can get these values when you set up the backend on AWS).

You can also rerun this command at any time to update your client to the latest version of the API.

### Development server
Run `npm start` for a dev server.
Navigate to `http[s]://{YOUR_HOSTNAME}:8080/`.
The app will automatically reload if you change any of the source files.

## Building

Run `npm run build` to build the project.
Artifacts will be stored in the `dist/` directory.
Use `npm run build:prod` for a production build.

## Testing

Currently, testing is configured against the [Chrome](https://www.google.com/chrome/) browser.
Please make sure the most recent version (>= 55) is installed.

### Unit tests

Run `npm run test` to execute unit tests via [Karma](https://karma-runner.github.io).
To test only once, append `npm run test:once`.

### End-to-end tests

Run `npm run e2e` to execute end-to-end tests via [Protractor](http://www.protractortest.org/).

### Headless systems

If you are on a Linux system without a local display,
please use `npm run headless test|test:once|e2e` instead.
These commands start a virtual framebuffer through
[Xvfb](https://www.x.org/archive/X11R7.6/doc/man/man1/Xvfb.1.xhtml),
so make sure that [`xvfb-run`](http://manpages.ubuntu.com/manpages/trusty/man1/xvfb-run.1.html)
is present on your system.

### Linting

To check style of the source files, use `npm run lint`.
You can also attempt to fix some errors automatically with `npm run lint:fix`.
