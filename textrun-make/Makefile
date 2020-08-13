build:  # builds for the current platform
	@echo textrun-make build ...
	@${CURDIR}/node_modules/.bin/tsc -p tsconfig.json

clean:  # Removes all build artifacts
	@echo textrun-make build artifact cleanup ...
	@rm -rf dist

cuke: build  # runs the feature specs
	@echo textrun-make E2E tests ...
	@${CURDIR}/node_modules/.bin/cucumber-js --format progress-bar

docs: build  # runs the documentation tests
	@echo textrun-make documentation tests ...
	@rm -rf tmp
	@${CURDIR}/node_modules/.bin/text-run static --offline --format progress
	@${CURDIR}/node_modules/.bin/text-run dynamic --format progress

fix:  # runs the auto-fixers
	@echo textrun-make auto-fixes ...
	@${CURDIR}/node_modules/.bin/tslint --project tsconfig.json --fix
	@${CURDIR}/node_modules/.bin/prettier --write .

help:  # prints all make targets
	@cat Makefile | grep '^[^ ]*:' | grep -v '.PHONY' | grep -v help | sed 's/:.*#/#/' | column -s "#" -t

lint:  # lints all files in this codebase
	@echo textrun-make linters ...
	@${CURDIR}/node_modules/.bin/prettier -l .
	@${CURDIR}/node_modules/.bin/tslint --project tsconfig.json --config ../tslint.json

test: lint unit cuke docs  # runs all tests

test-ts: unit cuke  # runs all code tests

unit:  # runs the unit tests
	@echo textrun-make unit tests ...
	@${CURDIR}/node_modules/.bin/mocha --reporter dot "src/**/*.test.ts"