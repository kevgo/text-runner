build:  # builds for the current platform
	echo Text-Runner build ...
	${CURDIR}/node_modules/.bin/tsc -p tsconfig-build.json

clean:  # Removes all build artifacts
	echo Text-Runner build artifact cleanup ...
	rm -rf dist

cuke: build  # for manually running the cukes for this codebase
	(cd ${CURDIR}/../text-runner-features && make cuke)

cuke-lerna:  # cukes for this codebase are in ../text-runner-features, Lerna runs those

cuke-ci:  # runs the feature specs on CI
	${CURDIR}/node_modules/.bin/cucumber-js --tags "(not @todo)" --format=progress --parallel 8

cuke-online: build  # runs the feature specs that don't need an online connection
	echo running Text-Runner online feature specs ...
	${CURDIR}/node_modules/.bin/cucumber-js --tags "(not @todo) and @online" --format=progress-bar --parallel `node -e 'console.log(os.cpus().length)'`

docs:  # verify documentation
	echo Text-Runner documentation tests ...
	${CURDIR}/../text-runner-cli/bin/text-run --format=summary

fix:  # runs the fixers
	echo Text-Runner auto-fixes ...
	${CURDIR}/node_modules/.bin/tslint --project tsconfig.json --fix
	${CURDIR}/node_modules/.bin/prettier --write .

help:  # prints all make targets
	cat Makefile | grep '^[^ ]*:' | grep -v '.PHONY' | grep -v help | sed 's/:.*#/#/' | column -s "#" -t

lint:  # lints all files in this codebase
	echo Text-Runner linters ...
	${CURDIR}/node_modules/.bin/prettier -l .
	${CURDIR}/node_modules/.bin/tslint --project tsconfig.json --config ../tslint.json

parallel: lint  # runs all tests in parallel
	${CURDIR}/bin/text-run static --format=dot &
	${CURDIR}/node_modules/.bin/mocha --reporter dot "src/**/*.test.ts" &
	${CURDIR}/bin/text-run dynamic --format=dot
	${CURDIR}/node_modules/.bin/cucumber-js --tags "(not @online) and (not @todo)" --format=progress --parallel `node -e 'console.log(os.cpus().length)'`

prepublish: build  # prepares the code base for publishing
	rm dist/tsconfig-build.tsbuildinfo
	find dist -name '*.map' | xargs rm

stats:  # shows code statistics
	find . -type f | grep -v '/node_modules/' | grep -v '/dist/' | grep -v '\./.git/' | grep -v '\./\.vscode/' | grep -v '\./tmp/' | xargs scc

test: lint unit cuke docs  # runs all tests
test-lerna: lint unit cuke-lerna docs  # for running all tests inside Lerna
test-ts: unit cuke  # runs only the TypeScript tests
test-online: lint unit cuke-online docs   # runs all tests that don't need an online connection

unit:  # runs the unit tests
	echo Text-Runner unit tests ...
	${CURDIR}/node_modules/.bin/mocha --reporter dot "{src,features}/**/*.test.ts"

.SILENT:
