build:  # builds for the current platform
	echo shared features build ...
	${CURDIR}/../../node_modules/.bin/tsc -p tsconfig-build.json

clean:  # Removes all build artifacts
	echo shared features build artifact cleanup ...
	rm -rf dist

cuke:
cuke-lerna:

doc:  # runs the documentation tests

fix:  # runs the auto-fixers
	echo shared features auto-fixes ...
	${CURDIR}/../../node_modules/.bin/eslint . --fix --ext .ts --ignore-path ../../.eslintignore
	${CURDIR}/../../node_modules/.bin/prettier --write .

help:  # prints all make targets
	cat Makefile | grep '^[^ ]*:' | grep -v '.PHONY' | grep -v help | sed 's/:.*#/#/' | column -s "#" -t

lint:  # lints all files in this codebase
	echo shared features linters ...
	${CURDIR}/../../node_modules/.bin/prettier -l . & \
	${CURDIR}/../../node_modules/.bin/eslint . --ext .ts --ignore-path ../../.eslintignore & \
	${CURDIR}/../../node_modules/.bin/depcheck --config=../../.depcheckrc & \
	wait

test: unit cuke lint doc  # runs all tests
test-lerna: unit cuke-lerna lint doc  # for running all tests inside Lerna
test-ts: unit cuke  # runs all code tests

unit:  # runs the unit tests
	echo shared features unit tests ...
	${CURDIR}/node_modules/.bin/mocha --reporter dot "src/**/*.test.ts"

.SILENT:
