build:  # builds for the current platform
	@echo Text-Runner-E2E build ...

clean:  # Removes all build artifacts
	@echo Text-Runner-E2E build artifact cleanup ...

cuke: build  # runs the feature specs
	@echo Text-Runner E2E tests ...
	@${CURDIR}/node_modules/.bin/cucumber-js --tags "(not @todo)" --format progress-bar --parallel `node -e 'console.log(os.cpus().length)'`

cuke-ci:  # runs the feature specs on CI
	@${CURDIR}/node_modules/.bin/cucumber-js --tags "(not @todo)" --format progress --parallel 8

cuke-offline: build  # runs the feature specs that don't need an online connection
	@echo running Text-Runner offline feature specs ...
	@${CURDIR}/node_modules/.bin/cucumber-js --tags "(not @online) and (not @todo)" --format progress-bar --parallel `node -e 'console.log(os.cpus().length)'`

cuke-win:  # runs the feature specs on Windows
	@${CURDIR}/node_modules/.bin/cucumber-js --tags '(not @todo) and (not @skipWindows)' --format progress --parallel `node -e 'console.log(os.cpus().length)'`

docs:  # verify documentation
	@echo Text-Runner-E2E documentation tests ...

fix:  # runs the fixers
	@echo Text-Runner-E2E auto-fixes ...

help:  # prints all make targets
	@cat Makefile | grep '^[^ ]*:' | grep -v '.PHONY' | grep -v help | sed 's/:.*#/#/' | column -s "#" -t

lint:  # lints all files in this codebase
	@echo Text-Runner-E2E linters ...

test: cuke  # runs all tests

unit:  # runs the unit tests
	@echo Text-Runner-E2E unit tests ...
