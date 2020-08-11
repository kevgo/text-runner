# TODO: remove
.DEFAULT_GOAL := spec

build: clean  # builds for the current platform
	@echo building Text-Runner ...
	@${CURDIR}/node_modules/.bin/tsc -p tsconfig-build.json

clean:  # Removes all build artifacts
	@rm -rf dist
	@rm -rf .nyc_output*

cuke: build  # runs the feature specs
	@echo e2e tests for Text-Runner ...
	@${CURDIR}/node_modules/.bin/cucumber-js --tags "(not @todo)" --format progress-bar --parallel `node -e 'console.log(os.cpus().length)'`

cuke-ci:  # runs the feature specs on CI
	@${CURDIR}/node_modules/.bin/cucumber-js --tags "(not @todo)" --format progress --parallel 8

cuke-offline: build  # runs the feature specs that don't need an online connection
	@echo running Text-Runner offline feature specs ...
	@${CURDIR}/node_modules/.bin/cucumber-js --tags "(not @online) and (not @todo)" --format progress-bar --parallel `node -e 'console.log(os.cpus().length)'`

cuke-smoke-win:  # runs the smoke tests
	@(cd text-runner && ${CURDIR}/node_modules/.bin/cucumber-js --tags '@smoke' --format progress)

cuke-win:  # runs the feature specs on Windows
	@${CURDIR}/node_modules/.bin/cucumber-js --tags '(not @todo) and (not @skipWindows)' --format progress --parallel `node -e 'console.log(os.cpus().length)'`

docs:  # verify documentation
	@echo documentation tests for Text-Runner ...
	@rm -rf tmp
	@${CURDIR}/bin/text-run static --format progress --offline
	@${CURDIR}/bin/text-run dynamic --format progress

fix:  # runs the fixers
	@echo fixing Text-Runner ...
	@${CURDIR}/node_modules/.bin/tslint --project tsconfig.json --fix
	@${CURDIR}/node_modules/.bin/prettier --write .

help:  # prints all make targets
	@cat Makefile | grep '^[^ ]*:' | grep -v '.PHONY' | grep -v help | sed 's/:.*#/#/' | column -s "#" -t

lint:  # lints all files in this codebase
	@echo linting Text-Runner ...
	@${CURDIR}/node_modules/.bin/prettier -l .
	@${CURDIR}/node_modules/.bin/tslint --project tsconfig.json --config ../tslint.json

parallel: lint  # runs all tests in parallel
	${CURDIR}/bin/text-run static --offline --format dot &
	${CURDIR}/node_modules/.bin/mocha --reporter dot "src/**/*.test.ts" &
	${CURDIR}/bin/text-run dynamic --format dot
	${CURDIR}/node_modules/.bin/cucumber-js --tags "(not @online) and (not @todo)" --format progress --parallel `node -e 'console.log(os.cpus().length)'`

prepublish: build  # prepares the code base for publishing
	rm dist/tsconfig-build.tsbuildinfo
	find dist -name '*.map' | xargs rm

stats:  # shows code statistics
	@find . -type f | grep -v '/node_modules/' | grep -v '/dist/' | grep -v '\./.git/' | grep -v '\./\.vscode/' | grep -v '\./tmp/' | xargs scc

test: lint unit cuke docs  # runs all tests
.PHONY: test

test-ts: unit cuke  # runs only the TypeScript tests

test-offline: lint unit cuke-offline docs   # runs all tests that don't need an online connection

unit:  # runs the unit tests
	@echo unit tests for Text-Runner ...
	@${CURDIR}/node_modules/.bin/mocha --reporter dot "{src,features}/**/*.test.ts"
