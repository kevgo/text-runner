build:  # builds for the current platform
	@echo Text-Runner build ...
	@${CURDIR}/node_modules/.bin/tsc -p tsconfig-build.json

clean:  # Removes all build artifacts
	@echo Text-Runner build artifact cleanup ...
	@rm -rf dist

cuke: build  # runs the feature specs
	@echo Text-Runner E2E tests ...
	@${CURDIR}/node_modules/.bin/cucumber-js --tags "(not @todo)" --format progress-bar --parallel `node -e 'console.log(os.cpus().length)'`

cuke-ci:  # runs the feature specs on CI
	@${CURDIR}/node_modules/.bin/cucumber-js --tags "(not @todo)" --format progress --parallel 8

cuke-offline: build  # runs the feature specs that don't need an online connection
	@echo running Text-Runner offline feature specs ...
	@${CURDIR}/node_modules/.bin/cucumber-js --tags "(not @online) and (not @todo)" --format progress-bar --parallel `node -e 'console.log(os.cpus().length)'`

cuke-win:  # runs the feature specs on Windows
	@${CURDIR}/node_modules/.bin/cucumber-js --tags '(not @todo) and (not @skipWindows)' --format progress --parallel `node -e 'console.log(os.cpus().length)'`

docs:  # verify documentation
	@echo Text-Runner documentation tests ...
	@rm -rf tmp
	@${CURDIR}/bin/text-run --format progress --offline

fix:  # runs the fixers
	@echo Text-Runner auto-fixes ...
	@${CURDIR}/node_modules/.bin/tslint --project tsconfig.json --fix
	@${CURDIR}/../node_modules/.bin/prettier --write .

help:  # prints all make targets
	@cat Makefile | grep '^[^ ]*:' | grep -v '.PHONY' | grep -v help | sed 's/:.*#/#/' | column -s "#" -t

lint:  # lints all files in this codebase
	@echo Text-Runner linters ...
	@${CURDIR}/../node_modules/.bin/prettier -l .
	@${CURDIR}/node_modules/.bin/tslint --project tsconfig.json --config ../tslint.json

parallel: lint  # runs all tests in parallel
	${CURDIR}/bin/text-run static --offline --format dot &
	${CURDIR}/../node_modules/.bin/mocha --reporter dot "src/**/*.test.ts" &
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
	@echo Text-Runner unit tests ...
	@${CURDIR}/../node_modules/.bin/mocha --reporter dot "{src,features}/**/*.test.ts"
