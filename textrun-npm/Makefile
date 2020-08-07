build:  # builds for the current platform
	@echo building textrun-npm ...
	@${CURDIR}/node_modules/.bin/tsc -p tsconfig.json

docs: build  # runs the documentation tests
	@echo documentation tests for textrun-npm ...
	@rm -rf tmp
	@${CURDIR}/node_modules/.bin/text-run static --offline --format progress
	@${CURDIR}/node_modules/.bin/text-run dynamic --format progress

help:  # prints all make targets
	@cat Makefile | grep '^[^ ]*:' | grep -v '.PHONY' | grep -v help | sed 's/:.*#/#/' | column -s "#" -t

test: unit docs  # runs all tests

unit:  # runs the unit tests
	@${CURDIR}/node_modules/.bin/mocha --reporter dot "src/**/*.test.ts"
