# Cumulous Web UI

**WARNING: This project is currently a work-in-progress,
meaning that the core features and
documentation are incomplete, and it should not be used
in production. We're working hard to make it happen.**

This project implements a web interface for the [Cumulous](https://github.com/cumulous) framework.

It uses [Angular](https://angular.io/) framework for single-page applications.

**Note:** the instructions below are for *development* only.
You don't need to do anything special for deployment, as
Amazon will pull this repo and build everything automatically
after you import the initial template.

## Setting up

### Environment

Please run `npm install` before doing anything else. You need to have at least
[Node.js](https://nodejs.org) 6.9 with NPM 3.10.

### API credentials

Prior to building the app or running e2e tests, you need to configure API credentials.
To do that in a [Bash](https://www.gnu.org/software/bash/) shell,
please run `npm run api`. It will cache the above values in the `tmp` folder
and reuse them, unless you delete that.

### Development server
Run `HOST=<YOUR_PUBLIC_HOSTNAME> npm start` for a dev server.
Navigate to `http[s]://<YOUR_PUBLIC_HOSTNAME>:8080/`.
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

### Code coverage

Running unit tests as above will also generate live code coverage reports.
You can browse them by navigating to
`http[s]://{YOUR_HOSTNAME}:8082/coverage/src/app/index.html`.

### End-to-end tests

Run `npm run e2e` to execute end-to-end tests via [Protractor](http://www.protractortest.org/).

### Linting

To check style of the source files, use `npm run lint`.
You can also attempt to fix some errors automatically with `npm run lint:fix`.

### Special Notes

To reduce verbosity of the `npm run` commands, use `npm run -s` instead.
