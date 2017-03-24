# SASSY UI

This project implements a web interface for
the Serverless Application System for Storage and analYsis (SASSY) of scientific data.

It builds upon [Angular 2](https://angular.io/) framework for single-page applications.

## Setting up

### API client

Prior to building the app or running any tests, you need to configure the API client.
To do that in a [Bash](https://www.gnu.org/software/bash/) shell,
please run `npm run api <ARTIFACTS_BUCKET> [<BACKEND_STAGE>]`
with the name of the [S3](https://aws.amazon.com/s3/) bucket where your artifacts are stored on AWS
(you need to get read access to that bucket's `api/<BACKEND_STAGE>/swagger.yaml` object first),
and an optional name of the backend stage (`beta` or `release`)
for which to generate the client.

You can also rerun this command at any time to update your client to the latest version of the API.
We don't track the client in Git, instead we regenerate it on every build in
[AWS CodeBuild](https://aws.amazon.com/codebuild/).
This is done intentionally to ensure the client stays current with the API.
You're encouraged to periodically update the local development version as described above,
to discover potential compatibility issues before it reaches CodeBuild.

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
