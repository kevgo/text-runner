build:  # builds for the current platform
	@echo shared features build ...
	@${CURDIR}/../../node_modules/.bin/tsc -p tsconfig.json

clean:  # Removes all build artifacts
	@echo shared features build artifact cleanup ...
	@rm -rf dist

cuke: build  # runs the feature specs
	@echo shared features E2E tests ...

docs:  # runs the documentation tests
	@echo shared features documentation tests ...

fix:  # runs the auto-fixers
	@echo shared features auto-fixes ...
	@${CURDIR}/../../node_modules/.bin/tslint --project tsconfig.json --fix
	@${CURDIR}/../../node_modules/.bin/prettier --write .

help:  # prints all make targets
	@cat Makefile | grep '^[^ ]*:' | grep -v '.PHONY' | grep -v help | sed 's/:.*#/#/' | column -s "#" -t

lint:  # lints all files in this codebase
	@echo shared features linters ...
	@${CURDIR}/../../node_modules/.bin/prettier -l .
	@${CURDIR}/../../node_modules/.bin/tslint --project tsconfig.json --config ../../tslint.json

test: lint unit cuke docs  # runs all tests

test-ts: unit cuke  # runs all code tests

unit:  # runs the unit tests
	@echo shared features unit tests ...
	@${CURDIR}/../../node_modules/.bin/mocha --reporter dot "src/**/*.test.ts"
