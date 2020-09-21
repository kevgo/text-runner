build:  # builds for the current platform
	echo textrun-shell build ...
	${CURDIR}/../node_modules/.bin/tsc -p tsconfig.json

clean:  # Removes all build artifacts
	echo textrun-shell build artifact cleanup ...
	rm -rf dist

cuke: build  # runs the feature specs
	${CURDIR}/node_modules/.bin/cucumber-js --format=progress-bar

cuke-lerna: build  # runs the feature specs
	echo textrun-shell E2E tests ...
	${CURDIR}/node_modules/.bin/cucumber-js --format=summary

docs: build  # runs the documentation tests
	echo textrun-shell documentation tests ...
	cd examples/global-tool && ${CURDIR}/node_modules/.bin/text-run --format=summary
	${CURDIR}/node_modules/.bin/text-run static --format=summary
	${CURDIR}/node_modules/.bin/text-run dynamic --format=progress

fix:  # runs the auto-fixers
	echo textrun-shell auto-fixes ...
	${CURDIR}/../node_modules/.bin/eslint . --fix --ext .ts --ignore-path ../.eslintignore
	${CURDIR}/../node_modules/.bin/prettier --write .

help:  # prints all make targets
	cat Makefile | grep '^[^ ]*:' | grep -v '.PHONY' | grep -v help | sed 's/:.*#/#/' | column -s "#" -t

lint:  # lints all files in this codebase
	echo textrun-shell linters ...
	${CURDIR}/../node_modules/.bin/prettier -l .
	${CURDIR}/../node_modules/.bin/eslint . --ext .ts --ignore-path ../.eslintignore

test: lint unit cuke docs  # runs all tests
test-lerna: lint unit cuke-lerna docs  # for running all tests inside Lerna
test-ts: unit cuke  # runs all code tests

unit:  # runs the unit tests
	echo textrun-shell unit tests ...
	${CURDIR}/node_modules/.bin/mocha --reporter dot "src/**/*.test.ts"

.SILENT:
