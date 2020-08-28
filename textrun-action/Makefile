build:  # builds for the current platform
	echo textrun-action build ...
	${CURDIR}/node_modules/.bin/tsc -p tsconfig.json

clean:  # Removes all build artifacts
	echo textrun-action build artifact cleanup ...
	rm -rf dist

cuke:

docs: build  # runs the documentation tests
	echo textrun-action documentation tests ...
	rm -rf tmp
	${CURDIR}/node_modules/.bin/text-run static --offline --format progress
	${CURDIR}/node_modules/.bin/text-run dynamic --format progress

fix:  # runs the auto-fixers
	echo textrun-action auto-fixes ...
	${CURDIR}/node_modules/.bin/tslint --project tsconfig.json --fix
	${CURDIR}/node_modules/.bin/prettier --write .

help:  # prints all make targets
	cat Makefile | grep '^[^ ]*:' | grep -v '.PHONY' | grep -v help | sed 's/:.*#/#/' | column -s "#" -t

lint:  # lints all files in this codebase
	echo textrun-action linters ...
	${CURDIR}/node_modules/.bin/prettier -l .
	${CURDIR}/node_modules/.bin/tslint --project tsconfig.json --config ../tslint.json

test: lint docs  # runs all tests

unit:

.SILENT:
