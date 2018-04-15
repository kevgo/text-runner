.DEFAULT_GOAL := spec

build: clean    # builds for the current platform
	@mkdir dist
	@cd src ; find . -name "*.js" | sed 's/^.\///' | xargs ../node_modules/.bin/flow-remove-types -d ../dist/ -q

clean:   # Removes all build artifacts
	@rm -rf dist
	@rm -rf .nyc_output*

coverage-build:   # builds the code base with code coverage measurements baked in
	BABEL_ENV=test_coverage ./node_modules/.bin/babel src -d dist -q

coverage-tests: coverage-build # test coverage for unit tests
	# TODO: fix this
	# BABEL_ENV=test_coverage ./node_modules/.bin/nyc ./node_modules/.bin/mocha "src/**/*-test.js" --reporter dot
	# mv .nyc_output .nyc_output_tests
	# test coverage for API specs

coverage-api:  # determines test coverage for API tests
	rm -rf .nyc_output_api
	BABEL_ENV=test_coverage NODE_ENV=test EXOSERVICE_TEST_DEPTH=API node_modules/.bin/nyc node_modules/.bin/cucumber-js --tags '(not @clionly) and (not @todo)'
	mv .nyc_output .nyc_output_api

coverage-cli:  # test coverage for CLI specs
	rm -rf .nyc_output_cli
	NODE_ENV=coverage EXOSERVICE_TEST_DEPTH=CLI node_modules/.bin/cucumber-js --tags '(not @apionly) and (not @todo)'

coverage-docs:  # test coverage for the self-check
	rm -rf .nyc_output_text_run
	./node_modules/.bin/nyc bin/text-run --offline
	mv .nyc_output .nyc_output_text_run

coverage-merge: # merge all coverage results together
	rm -rf .nyc_output
	mkdir .nyc_output
	node scripts/cleanse-coverage.js

coverage-html:  # render test coverage as a HTML report
	node_modules/.bin/nyc report --reporter=lcov
	@echo "open 'file://$(shell pwd)/coverage/lcov-report/index.html' in your browser"

coverage-send:  # sends the coverage to coveralls.io
	node_modules/.bin/nyc report --reporter=text-lcov | node_modules/.bin/coveralls

coverage: coverage-build coverage-tests coverage-api coverage-cli coverage-html   # measures code coverage
.PHONY: coverage

cukeapi: build   # runs the API tests
ifndef FILE
	NODE_ENV=test EXOSERVICE_TEST_DEPTH=API node_modules/.bin/cucumber-js --tags '(not @clionly) and (not @todo)' --format progress
else
	DEBUG='*,-babel' NODE_ENV=test EXOSERVICE_TEST_DEPTH=API node_modules/.bin/cucumber-js --tags '(not @clionly) and (not @todo)' $(FILE)
endif

cukecli: build   # runs the CLI tests
ifndef FILE
	EXOSERVICE_TEST_DEPTH=CLI node_modules/.bin/cucumber-js --tags '(not @apionly) and (not @todo)' --format progress
else
	EXOSERVICE_TEST_DEPTH=CLI node_modules/.bin/cucumber-js --tags '(not @apionly) and (not @todo)' $(FILE)
endif

deploy: build  # deploys a new version to npmjs.org
	yarn version
	git push
	git push --tags
	npm publish

docs: build   # runs the documentation tests
ifndef FILE
	bin/text-run --offline
else
	DEBUG='*,-babel,-text-stream-accumulator,-text-stream-search' bin/text-run --format detailed $(FILE)
endif

features: build   # runs the feature specs
ifndef FILE
	make cuke-api
	make cuke-cli
else
	make cuke-api $(FILE)
	make cuke-cli $(FILE)
endif

help:   # prints all make targets
	@cat Makefile | grep '^[^ ]*:' | grep -v '.PHONY' | grep -v help | sed 's/:.*#/#/' | column -s "#" -t

lint: lintjs lintmd   # lints all files

lintjs: build   # lints the javascript files
	node_modules/.bin/standard -v
	node_modules/.bin/flow
	node_modules/.bin/dependency-lint

lintmd:   # lints markdown files
	node_modules/.bin/remark .

setup:   # sets up the installation on this machine
	go get github.com/tj/node-prune
	rm -rf node_modules
	yarn install
	node-prune

spec: lint tests cukeapi cukecli docs   # runs all tests

tests: build  # runs the unit tests
	node_modules/.bin/mocha --reporter dot "src/**/*-test.js"

travis: lint coverage   # the set of tests running on Travis-CI

upgrade:   # updates the dependencies to their latest versions
	yarn upgrade-interactive
	flow-typed install --overwrite
	rm flow-typed/npm/remarkable_v1.x.x.js
