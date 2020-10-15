build:  # builds for the current platform
	echo text-runner build ...
	${CURDIR}/../node_modules/.bin/tsc -p tsconfig-build.json

clean:  # Removes all build artifacts
	echo text-runner build artifact cleanup ...
	rm -rf dist

cuke:
cuke-lerna:

doc:
	echo text-runner documentation tests ...
	${CURDIR}/../text-runner-cli/bin/text-run --format=summary

fix:  # runs the fixers
	echo text-runner auto-fixes ...
	${CURDIR}/../node_modules/.bin/eslint . --fix --ext .ts --ignore-path ../.eslintignore
	${CURDIR}/../node_modules/.bin/prettier --write .

help:  # prints all make targets
	cat Makefile | grep '^[^ ]*:' | grep -v '.PHONY' | grep -v help | sed 's/:.*#/#/' | column -s "#" -t

lint:  # lints all files in this codebase
	echo text-runner linters ...
	${CURDIR}/../node_modules/.bin/eslint . --ext .ts --ignore-path ../.eslintignore
	${CURDIR}/../node_modules/.bin/prettier -l .

publish: clean build  # publishes this package
	npm publish

stats:  # shows code statistics
	find . -type f | grep -v '/node_modules/' | grep -v '/dist/' | grep -v '\./.git/' | grep -v '\./\.vscode/' | grep -v '\./tmp/' | xargs scc

test: unit lint doc  # runs all tests
test-lerna: unit lint doc  # for running all tests inside Lerna

unit:  # runs the unit tests
	echo text-runner unit tests ...
	${CURDIR}/node_modules/.bin/mocha --reporter dot "src/**/*.test.ts"

.SILENT:
