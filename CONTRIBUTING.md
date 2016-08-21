# Tutorial Runner Developer Documentation

## Installation

* `npm i`


## Testing

* run all tests: `cucumber-js`

To debug a single test:
* enable console output: add the `@verbose` tag
* enable debugging output: add the `@debug` tag


## Architecture

- tests use 'tmp' as the workspace for creating files
- the feature tests run inside the `test-dir` directory
