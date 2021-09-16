build:  # builds for the current platform

clean:  # Removes all build artifacts

cuke:
cuke-lerna:

doc: build  # runs the documentation tests
	echo documentation doc-tests ...
	${CURDIR}/node_modules/.bin/text-run static --format=summary
	${CURDIR}/node_modules/.bin/text-run dynamic --format=progress

fix:  # runs the auto-fixers
	echo documentation auto-fixes ...
	${CURDIR}/../node_modules/.bin/prettier --write .

help:  # prints all make targets
	cat Makefile | grep '^[^ ]*:' | grep -v '.PHONY' | grep -v help | sed 's/:.*#/#/' | column -s "#" -t

lint:  # lints all files in this codebase
	echo documentation linters ...
	${CURDIR}/../node_modules/.bin/prettier -l . & \
	${CURDIR}/../node_modules/.bin/depcheck --config=../.depcheckrc & \
	wait

test: unit cuke lint doc  # runs all tests
test-lerna: lint unit cuke-lerna doc  # for running all tests inside Lerna
test-ts: unit cuke  # runs all code tests

unit:  # runs the unit tests

.SILENT:
