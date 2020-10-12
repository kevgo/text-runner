build:  # builds for the current platform

clean:  # Removes all build artifacts

cuke:
cuke-lerna:

docs: build  # runs the documentation tests
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
	${CURDIR}/../node_modules/.bin/prettier -l .
	${CURDIR}/../node_modules/.bin/depcheck --config=../.depcheckrc --ignores=`${CURDIR}/../node_modules/.bin/lerna ls -a | cut -d ' ' -f1 | paste -s -d, -`

test: lint unit cuke docs  # runs all tests
test-lerna: lint unit cuke-lerna docs  # for running all tests inside Lerna
test-ts: unit cuke  # runs all code tests

unit:  # runs the unit tests

# .SILENT:
