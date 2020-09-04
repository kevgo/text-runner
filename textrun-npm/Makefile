build:  # builds for the current platform
	echo textrun-npm build ...
	${CURDIR}/node_modules/.bin/tsc -p tsconfig.json

clean:  # Removes all build artifacts
	echo textrun-npm build artifact cleanup ...
	rm -rf dist

cuke: build  # runs the feature specs
	${CURDIR}/node_modules/.bin/cucumber-js --format progress-bar

cuke-lerna: build  # runs the feature specs
	echo textrun-npm E2E tests ...
	${CURDIR}/node_modules/.bin/cucumber-js --format summary

docs: build  # runs the documentation tests
	echo textrun-npm documentation tests ...
	${CURDIR}/node_modules/.bin/text-run static --format progress
	${CURDIR}/node_modules/.bin/text-run dynamic --format progress

fix:  # runs the auto-fixers
	echo textrun-npm auto-fixes ...
	${CURDIR}/node_modules/.bin/tslint --project tsconfig.json --fix
	${CURDIR}/node_modules/.bin/prettier --write .

help:  # prints all make targets
	cat Makefile | grep '^[^ ]*:' | grep -v '.PHONY' | grep -v help | sed 's/:.*#/#/' | column -s "#" -t

lint:  # lints all files in this codebase
	echo textrun-npm linters ...
	${CURDIR}/node_modules/.bin/prettier -l .
	${CURDIR}/node_modules/.bin/tslint --project tsconfig.json --config ../tslint.json

test: lint unit cuke docs  # runs all tests
test-lerna: lint unit cuke-lerna docs  # for running all tests inside Lerna
test-ts: unit cuke  # runs all code tests

unit:  # runs the unit tests
	echo textrun-npm unit tests ...
	${CURDIR}/node_modules/.bin/mocha --reporter dot "src/**/*.test.ts"

.SILENT:
