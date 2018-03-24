.DEFAULT_GOAL := spec


# builds for the current platform
build: clean
	mkdir dist
	cd src ; find . -name "*.js" | sed 's/^.\///' | xargs ../node_modules/.bin/flow-remove-types -d ../dist/ -q

# Removes all build artifacts
clean:
	rm -rf dist
	rm -rf .nyc_output*

coverage: coverage-unit-tests coverage-api coverage-cli coverage-textrun
	rm -rf .nyc_output
	mkdir .nyc_output
	node bin/cleanse-coverage.js
	nyc report --reporter=lcov
	echo "open 'file://$(pwd)/coverage/lcov-report/index.html' in your browser"


# builds with test coverage measurements
coverage-prepare:
	BABEL_ENV=test_coverage ./node_modules/.bin/babel src -d dist -q

# test coverage for unit tests
coverage-unit-tests: coverage-prepare
	# TODO: fix this
	# BABEL_ENV=test_coverage ./node_modules/.bin/nyc ./node_modules/.bin/mocha "src/**/*-test.js" --reporter dot
	# mv .nyc_output .nyc_output_tests
	rm -rf .nyc_output_tests
	mkdir .nyc_output_tests

# test coverage for API specs
coverage-api: coverage-prepare
	rm -rf .nyc_output
	rm -rf .nyc_output_api
	BABEL_ENV=test_coverage NODE_ENV=test EXOSERVICE_TEST_DEPTH=API nyc node_modules/.bin/cucumber-js --tags '(not @clionly) and (not @todo)'
	mv .nyc_output .nyc_output_api

# test coverage for CLI specs
coverage-cli: coverage-prepare
	rm -rf .nyc_output
	rm -rf .nyc_output_cli
	BABEL_ENV=test_coverage NODE_ENV=coverage EXOSERVICE_TEST_DEPTH=CLI nyc node_modules/.bin/cucumber-js --tags '(not @apionly) and (not @todo)'

# test coverage for the self-check
coverage-textrun: coverage-prepare
	rm -rf .nyc_output
	rm -rf .nyc_output_text_run
	./node_modules/.bin/nyc bin/text-run --offline
	mv .nyc_output .nyc_output_text_run
