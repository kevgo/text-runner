.DEFAULT_GOAL := help


build:  # builds for the current platform
	echo text-runner-cli build ...
	${CURDIR}/../node_modules/.bin/tsc -p tsconfig-build.json

clean:  # Removes all build artifacts
	echo text-runner-cli artifact cleanup ...
	rm -rf dist

cuke: build  # for manually running the cukes for this codebase
	(cd ${CURDIR}/../text-runner-features && make --no-print-directory cuke-cli)

cuke-lerna:  # cukes for this codebase are in ../text-runner-features, Lerna runs those

cuke-online: build  # runs the feature specs that don't need an online connection
	echo running Text-Runner online feature specs ...
	${CURDIR}/../node_modules/.bin/cucumber-js --tags "(not @todo) and @online" --format=progress-bar --parallel `node -e 'console.log(os.cpus().length)'`

doc:  # verify documentation
	echo Text-Runner documentation tests ...
	${CURDIR}/../node_modules/.bin/text-run --format=summary

fix:  # runs the fixers
	echo Text-Runner auto-fixes ...
	${CURDIR}/../node_modules/.bin/eslint . --fix --ext .ts --ignore-path ../.eslintignore
	${CURDIR}/../node_modules/.bin/prettier --write .

help:  # prints all make targets
	cat Makefile | grep '^[^ ]*:' | grep -v '.PHONY' | grep -v help | sed 's/:.*#/#/' | column -s "#" -t

lint:  # lints all files in this codebase
	echo Text-Runner linters ...
	${CURDIR}/../node_modules/.bin/prettier -l .
	${CURDIR}/../node_modules/.bin/eslint . --ext .ts --ignore-path ../.eslintignore
	${CURDIR}/../node_modules/.bin/depcheck --config=../.depcheckrc

parallel: lint  # runs all tests in parallel
	${CURDIR}/bin/text-run static --format=dot &
	${CURDIR}/../node_modules/.bin/mocha --reporter dot "src/**/*.test.ts" &
	${CURDIR}/bin/text-run dynamic --format=dot
	${CURDIR}/../node_modules/.bin/cucumber-js --tags "(not @online) and (not @todo)" --format=progress --parallel `node -e 'console.log(os.cpus().length)'`

publish: clean build  # publishes this package
	npm publish

stats:  # shows code statistics
	find . -type f | grep -v '/node_modules/' | grep -v '/dist/' | grep -v '\./.git/' | grep -v '\./\.vscode/' | grep -v '\./tmp/' | xargs scc

test: unit cuke lint doc  # runs all tests
test-lerna: lint unit cuke-lerna doc  # for running all tests inside Lerna
test-ts: unit cuke  # runs only the TypeScript tests
test-online: lint unit cuke-online doc   # runs all tests that don't need an online connection

unit:  # runs the unit tests
	echo Text-Runner unit tests ...
	${CURDIR}/../node_modules/.bin/mocha --reporter dot "{src,features}/**/*.test.ts"

.SILENT:
