build:  # builds for the current platform
	@echo building textrun-npm ...
	@${CURDIR}/node_modules/.bin/tsc -p tsconfig.json

clean:  # Removes all build artifacts
	@rm -rf dist

cuke: build  # runs the feature specs
	@echo e2e tests for textrun-npm ...
	@${CURDIR}/node_modules/.bin/cucumber-js --format progress-bar

docs: build  # runs the documentation tests
	@echo documentation tests for textrun-npm ...
	@rm -rf tmp
	@${CURDIR}/node_modules/.bin/text-run static --offline --format progress
	@${CURDIR}/node_modules/.bin/text-run dynamic --format progress

fix:  # runs the auto-fixers
	@echo fixing textrun-npm ...
	@${CURDIR}/node_modules/.bin/tslint --project tsconfig.json --fix
	@${CURDIR}/node_modules/.bin/prettier --write .

help:  # prints all make targets
	@cat Makefile | grep '^[^ ]*:' | grep -v '.PHONY' | grep -v help | sed 's/:.*#/#/' | column -s "#" -t

lint:  # lints all files in this codebase
	@echo linting textrun-npm ...
	@${CURDIR}/node_modules/.bin/prettier -l .
	@${CURDIR}/node_modules/.bin/tslint --project tsconfig.json --config ../tslint.json

test: lint unit cuke docs  # runs all tests

test-ts: unit cuke  # runs all code tests

unit:  # runs the unit tests
	@echo unit tests for textrun-npm ...
	@${CURDIR}/node_modules/.bin/mocha --reporter dot "src/**/*.test.ts"
