build:  # builds for the current platform
	@echo building ...
	@${CURDIR}/node_modules/.bin/tsc -p tsconfig.json

docs:  # runs the documentation tests
	@echo documentation tests ...
	@rm -rf tmp
	@${CURDIR}/node_modules/.bin/text-run --offline --format progress

help:  # prints all make targets
	@cat Makefile | grep '^[^ ]*:' | grep -v '.PHONY' | grep -v help | sed 's/:.*#/#/' | column -s "#" -t

test: unit docs  # runs all tests

unit:  # runs the unit tests
	@${CURDIR}/node_modules/.bin/mocha --reporter dot "src/**/*.test.ts"
