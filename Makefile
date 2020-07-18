.DEFAULT_GOAL := spec

build: clean  # builds for the current platform
	@echo building ...
	@${CURDIR}/node_modules/.bin/tsc -p tsconfig-build.json
	@rm ${CURDIR}/dist/**/*.test.*

build-debug: clean  # builds for debugging
	@${CURDIR}/node_modules/.bin/tsc -p tsconfig-build.json --sourcemap

clean:  # Removes all build artifacts
	@rm -rf dist
	@rm -rf .nyc_output*

coverage-build:  # builds the code base with code coverage measurements baked in
	./node_modules/.bin/babel src -d dist --extensions ".ts"

coverage-tests:  # test coverage for unit tests
	BABEL_ENV=test_coverage ./node_modules/.bin/nyc ./node_modules/.bin/mocha "src/**/*.test.js" --reporter dot
	mv .nyc_output .nyc_output_tests

coverage-cuke-other:  # test coverage for CLI specs
	rm -rf .nyc_output_cli_other
	NODE_ENV=coverage node_modules/.bin/cucumber-js --tags '(not @todo)' 'features/!(actions|commands|images|formatters|tag-types)'
	mv .nyc_output_cli .nyc_output_cuke_other

coverage-cuke-actions:  # test coverage for CLI specs
	rm -rf .nyc_output_cli
	NODE_ENV=coverage node_modules/.bin/cucumber-js --tags '(not @todo)' 'features/+(actions|images)'
	mv .nyc_output_cli .nyc_output_cuke_actions

coverage-cuke-tagtypes:  # test coverage for CLI specs
	rm -rf .nyc_output_cli
	NODE_ENV=coverage node_modules/.bin/cucumber-js --tags '(not @todo)' 'features/+(tag-types|commands|formatters)'
	mv .nyc_output_cli .nyc_output_cuke_tagtypes

coverage-docs:  # test coverage for the self-check
	rm -rf .nyc_output_text_run
	./node_modules/.bin/nyc bin/text-run --offline
	mv .nyc_output .nyc_output_text_run

coverage-merge:  # merge all coverage results together
	rm -rf .nyc_output
	mkdir .nyc_output
	ls -1 .nyc_output_tests | cat -n | while read n f; do cp ".nyc_output_tests/$$f" ".nyc_output/tests_$$n.json"; done
	ls -1 .nyc_output_text_run | cat -n | while read n f; do cp ".nyc_output_text_run/$$f" ".nyc_output/textrun_$$n.json"; done
	find .nyc_output_cuke_other -type f | cat -n | while read n f; do cp "$$f" ".nyc_output/cli_other_$$n.json"; done
	find .nyc_output_cuke_actions -type f | cat -n | while read n f; do cp "$$f" ".nyc_output/cli_actions_$$n.json"; done
	find .nyc_output_cuke_tagtypes -type f | cat -n | while read n f; do cp "$$f" ".nyc_output/cli_tagtypes_$$n.json"; done

coverage-html:  # render test coverage as a HTML report
	${CURDIR}/node_modules/.bin/nyc report --reporter=lcov
	@echo "open 'file://$(shell pwd)/coverage/lcov-report/index.html' in your browser"

coverage-send:  # sends the coverage to coveralls.io
	${CURDIR}/node_modules/.bin/nyc report --reporter=text-lcov | node_modules/.bin/coveralls

coverage: coverage-build coverage-tests coverage-cli coverage-docs  # measures code coverage
.PHONY: coverage

cuke: build  # runs the feature specs
	@echo running feature specs ...
	@${CURDIR}/node_modules/.bin/cucumber-js --tags "(not @todo)" --format progress-bar --parallel `node -e 'console.log(os.cpus().length)'`

cuke-other:  # test coverage for CLI specs
	${CURDIR}/node_modules/.bin/cucumber-js --tags "(not @todo)" "features/!(actions|commands|images|formatters|tag-types)"

cuke-actions:  # test coverage for CLI specs
	${CURDIR}/node_modules/.bin/cucumber-js --tags "(not @todo)" "features/+(actions|images)"

cuke-tagtypes:  # test coverage for CLI specs
	${CURDIR}/node_modules/.bin/cucumber-js --tags "(not @todo)" "features/+(tag-types|commands|formatters)"

cuke-offline: build  # runs the feature specs that don't need an online connection
	@echo running feature specs ...
	@${CURDIR}/node_modules/.bin/cucumber-js --tags "(not @online) and (not @todo)" --format progress --parallel `node -e 'console.log(os.cpus().length)'`

cuke-smoke-win:  # runs the smoke tests
	@${CURDIR}/node_modules/.bin/cucumber-js --tags '@smoke' --format progress

cuke-win:  # runs the feature specs on Windows
	@${CURDIR}/node_modules/.bin/cucumber-js --tags '(not @todo) and (not @skipWindows)' --format progress --parallel `node -e 'console.log(os.cpus().length)'`

docs: build  # runs the documentation tests
	@echo running document tests ...
	@${CURDIR}/bin/text-run static --offline --format dot
	@echo
	@${CURDIR}/bin/text-run dynamic --format progress

fix:  # runs the fixers
	${CURDIR}/node_modules/.bin/tslint --project tsconfig.json --fix
	${CURDIR}/node_modules/.bin/prettier --write .

help:  # prints all make targets
	@cat Makefile | grep '^[^ ]*:' | grep -v '.PHONY' | grep -v help | sed 's/:.*#/#/' | column -s "#" -t

lint:  # lints all files
	@${CURDIR}/node_modules/.bin/tsc -p tsconfig.json &
	@${CURDIR}/node_modules/.bin/tslint --project tsconfig-build.json &
	@${CURDIR}/node_modules/.bin/remark . --quiet &
	@${CURDIR}/node_modules/.bin/prettier --check .

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
