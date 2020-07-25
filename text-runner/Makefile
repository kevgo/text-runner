# TODO: remove
.DEFAULT_GOAL := spec

build: clean  # builds for the current platform
	@echo building ...
	@${CURDIR}/node_modules/.bin/tsc -p tsconfig-build.json

build-debug: clean  # builds for debugging
	@${CURDIR}/node_modules/.bin/tsc -p tsconfig-build.json --sourcemap

clean:  # Removes all build artifacts
	@rm -rf dist
	@rm -rf .nyc_output*

cuke: build  # runs the feature specs
	@echo running feature specs ...
	@${CURDIR}/node_modules/.bin/cucumber-js --tags "(not @todo)" --format progress-bar --parallel `node -e 'console.log(os.cpus().length)'`

cuke-win:  # runs the feature specs on Windows
	@${CURDIR}/node_modules/.bin/cucumber-js --tags '(not @todo) and (not @skipWindows)' --format progress --parallel `node -e 'console.log(os.cpus().length)'`

fix:  # runs the fixers
	${CURDIR}/node_modules/.bin/tslint --project tsconfig.json --fix

help:  # prints all make targets
	@cat Makefile | grep '^[^ ]*:' | grep -v '.PHONY' | grep -v help | sed 's/:.*#/#/' | column -s "#" -t

lint:  # lints all files in this codebase
	@make --no-print-directory lint-global &
	@(cd .. && ${CURDIR}/node_modules/.bin/prettier --check text-runner)

lint-global:  # the lint commands to run when running the global lint task
	${CURDIR}/node_modules/.bin/tslint --project tsconfig-build.json

parallel: lint  # runs all tests
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
	@${CURDIR}/node_modules/.bin/mocha --reporter dot "{src,features}/**/*.test.ts"
