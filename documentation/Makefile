build:  # builds for the current platform

clean:  # Removes all build artifacts

cuke: build  # runs the feature specs

docs: build  # runs the documentation tests
	@echo documentation doc-tests ...
	@rm -rf tmp
	@${CURDIR}/node_modules/.bin/text-run static --offline --format progress
	@${CURDIR}/node_modules/.bin/text-run dynamic --format progress

fix:  # runs the auto-fixers
	@echo documentation auto-fixes ...
	@${CURDIR}/../node_modules/.bin/prettier --write .

help:  # prints all make targets
	@cat Makefile | grep '^[^ ]*:' | grep -v '.PHONY' | grep -v help | sed 's/:.*#/#/' | column -s "#" -t

lint:  # lints all files in this codebase
	@echo documentation linters ...
	@${CURDIR}/node_modules/.bin/remark . --quiet &
	@${CURDIR}/../node_modules/.bin/prettier -l .

test: lint unit cuke docs  # runs all tests

test-ts: unit cuke  # runs all code tests

unit:  # runs the unit tests

.SILENT:
