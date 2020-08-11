clean:  # Removes all build artifacts
	@(cd text-runner && make --no-print-directory clean)
	@(cd textrun-action && make --no-print-directory clean)
	@(cd textrun-javascript && make --no-print-directory clean)
	@(cd textrun-npm && make --no-print-directory clean)
	@(cd textrun-shell && make --no-print-directory clean)

coverage-build:  # builds the code base with code coverage measurements baked in
	./src/node_modules/.bin/babel src -d dist --extensions ".ts"

coverage-tests:  # test coverage for unit tests
	BABEL_ENV=test_coverage ./src/node_modules/.bin/nyc ./src/node_modules/.bin/mocha "src/**/*.test.js" --reporter dot
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
	./src/node_modules/.bin/nyc bin/text-run --offline
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

cuke:  # runs the Cucumber tests
	@(cd src && make --no-print-directory cuke)

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
	@(cd text-runner && ${CURDIR}/node_modules/.bin/cucumber-js --tags '@smoke' --format progress)

docs:  # runs the documentation tests
	@echo documentation tests for root dir ...
	@${CURDIR}/text-runner/bin/text-run --offline --format progress "*.md"
	@(cd text-runner && make --no-print-directory docs)
	@(cd textrun-action && make --no-print-directory docs)
	@(cd textrun-javascript && make --no-print-directory docs)
	@(cd textrun-npm && make --no-print-directory docs)
	@(cd textrun-shell && make --no-print-directory docs)

fix:  # auto-fixes the root directory
	@echo fixing root dir ...
	${CURDIR}/node_modules/.bin/prettier --write .

fix-all: fix  # auto-fixes the entire mono-repo
	@(cd text-runner && make --no-print-directory fix)
	@(cd textrun-action && make --no-print-directory fix)
	@(cd textrun-javascript && make --no-print-directory fix)
	@(cd textrun-npm && make --no-print-directory fix)
	@(cd textrun-shell && make --no-print-directory fix)

help:  # prints all make targets
	@cat Makefile | grep '^[^ ]*:' | grep -v '.PHONY' | grep -v help | sed 's/:.*#/#/' | column -s "#" -t

lint:  # lints the root directory
	@echo linting root dir ...
	@${CURDIR}/node_modules/.bin/remark . --quiet &
	@${CURDIR}/node_modules/.bin/prettier -l '.'

lint-all: lint  # lints the entire mono-repo
	@(cd text-runner && make --no-print-directory lint)
	@(cd textrun-action && make --no-print-directory lint)
	@(cd textrun-javascript && make --no-print-directory lint)
	@(cd textrun-npm && make --no-print-directory lint)
	@(cd textrun-shell && make --no-print-directory lint)

setup:  # prepares the code base for development after cloning
	@yarn
	@(cd text-runner && make --no-print-directory build)
	@(cd textrun-action && make --no-print-directory build)
	@(cd textrun-javascript && make --no-print-directory build)
	@(cd textrun-npm && make --no-print-directory build)
	@(cd textrun-shell && make --no-print-directory build)

test:  # runs all tests
	@(cd text-runner && make --no-print-directory test)
	@(cd textrun-action && make --no-print-directory test)
	@(cd textrun-javascript && make --no-print-directory test)
	@(cd textrun-npm && make --no-print-directory test)
	@(cd textrun-shell && make --no-print-directory test)

test-ts:  # runs all code tests
	@(cd text-runner && make --no-print-directory test-ts)
	@(cd textrun-javascript && make --no-print-directory test-ts)
	@(cd textrun-npm && make --no-print-directory test-ts)
	@(cd textrun-shell && make --no-print-directory test-ts)

test-offline:  # runs all tests
	@(cd text-runner && make --no-print-directory test-offline)
