# SASSY UI

This project implements a web interface for
the Serverless Application System for Storage and analYsis (SASSY) of scientific data.

It builds upon [Angular](https://angular.io/) framework for single-page applications.

## Setting up

### Environment

Please run `npm install` before doing anything else. You need to have at least
[Node.js](https://nodejs.org) 6.9 with NPM 3.10 to achieve that.

In addition, you need JRE 7 or later to generate API client (see below).

### API client

Prior to building the app or running any tests, you need to configure the API client.
To do that in a [Bash](https://www.gnu.org/software/bash/) shell,
please run `npm run api`, then enter your API domain name,
[Auth0](https://auth0.com/) domain name, Auth0 client ID and Auth0 client secret.
You set/get these values when you deploy the backend through
[CloudFormation](https://aws.amazon.com/cloudformation/).

You can re-run this command at any time to update your client to the latest version of the API.
It will cache the above values in the `tmp` folder and reuse them, unless you delete that.

You can also read API documentation by navigating to
the `/node_modules/swagger-ui/dist/index.html` file in a browser.
You won't be able to call any endpoints however.

**Note:** We don't track the client in Git, instead we regenerate it on every build in
[AWS CodeBuild](https://aws.amazon.com/codebuild/).
This is done intentionally to ensure the client stays current with the API.
You're encouraged to periodically update the local development version as described above,
to discover potential compatibility issues before it reaches CodeBuild.

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
