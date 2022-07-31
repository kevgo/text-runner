.DEFAULT_GOAL := help


build:  # builds for the current platform
	echo textrun-extension build ...
	${CURDIR}/../node_modules/.bin/tsc -p tsconfig-build.json

clean:  # Removes all build artifacts
	echo textrun-extension build artifact cleanup ...
	rm -rf dist

cuke: build  # runs the feature specs
	${CURDIR}/node_modules/.bin/cucumber-js --format=progress-bar

cuke-lerna: build  # runs the feature specs
	echo textrun-extension E2E tests ...
	${CURDIR}/node_modules/.bin/cucumber-js --format=summary

doc: build  # runs the documentation tests
	echo textrun-extension documentation tests ...
	${CURDIR}/node_modules/.bin/text-run static --format=summary
	${CURDIR}/node_modules/.bin/text-run dynamic --format=progress

fix:  # runs the auto-fixers
	echo textrun-extension auto-fixes ...
	${CURDIR}/../node_modules/.bin/eslint . --fix --ext .ts --ignore-path ../.eslintignore
	${CURDIR}/../node_modules/.bin/prettier --write .
	${CURDIR}/../node_modules/.bin/sort-package-json

help:  # prints all make targets
	cat Makefile | grep '^[^ ]*:' | grep -v '.PHONY' | grep -v help | sed 's/:.*#/#/' | column -s "#" -t

lint:  # lints all files in this codebase
	echo textrun-extension linters ...
	${CURDIR}/../node_modules/.bin/prettier -l .
	${CURDIR}/../node_modules/.bin/eslint . --ext .ts --ignore-path ../.eslintignore
	${CURDIR}/../node_modules/.bin/depcheck
	${CURDIR}/../node_modules/.bin/sort-package-json --check

publish: clean build  # publishes this package
	npm publish

test: unit cuke lint doc  # runs all tests
test-lerna: unit cuke-lerna lint doc  # for running all tests inside Lerna
test-ts: unit cuke  # runs all code tests

unit:  # runs the unit tests
	echo textrun-extension unit tests ...
	${CURDIR}/../node_modules/.bin/mocha --reporter dot "src/**/*.test.ts"

.SILENT:
