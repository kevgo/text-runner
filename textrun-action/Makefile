build:  # builds for the current platform
	@echo building textrun-action ...
	@${CURDIR}/node_modules/.bin/tsc -p tsconfig.json

clean:  # Removes all build artifacts
	@rm -rf dist

docs: build  # runs the documentation tests
	@echo documentation tests for textrun-action ...
	@rm -rf tmp
	@${CURDIR}/node_modules/.bin/text-run static --offline --format progress
	@${CURDIR}/node_modules/.bin/text-run dynamic --format progress

fix:  # runs the auto-fixers
	@echo fixing textrun-action ...
	@${CURDIR}/node_modules/.bin/tslint --project tsconfig.json --fix
	@${CURDIR}/node_modules/.bin/prettier --write .

help:  # prints all make targets
	@cat Makefile | grep '^[^ ]*:' | grep -v '.PHONY' | grep -v help | sed 's/:.*#/#/' | column -s "#" -t

lint:  # lints all files in this codebase
	@echo linting textrun-action ...
	@${CURDIR}/node_modules/.bin/prettier -l .
	@${CURDIR}/node_modules/.bin/tslint --project tsconfig.json --config ../tslint.json

test: docs  # runs all tests
