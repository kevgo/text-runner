.DEFAULT_GOAL := spec


# builds for the current platform
build: clean
	mkdir dist
	cd src ; find . -name "*.js" | sed 's/^.\///' | xargs ../node_modules/.bin/flow-remove-types -d ../dist/ -q

# Removes all build artifacts
clean:
	rm -rf dist
	rm -rf .nyc_output*

coverage:
	BABEL_ENV=test_coverage ./node_modules/.bin/babel src -d dist -q
	# test coverage for unit tests
	# TODO: fix this
	# BABEL_ENV=test_coverage ./node_modules/.bin/nyc ./node_modules/.bin/mocha "src/**/*-test.js" --reporter dot
	# mv .nyc_output .nyc_output_tests
	# test coverage for API specs
	rm -rf .nyc_output
	rm -rf .nyc_output_api
	BABEL_ENV=test_coverage NODE_ENV=test EXOSERVICE_TEST_DEPTH=API nyc node_modules/.bin/cucumber-js --tags '(not @clionly) and (not @todo)'
	mv .nyc_output .nyc_output_api
	# test coverage for CLI specs
	rm -rf .nyc_output
	rm -rf .nyc_output_cli
	NODE_ENV=coverage EXOSERVICE_TEST_DEPTH=CLI node_modules/.bin/cucumber-js --tags '(not @apionly) and (not @todo)'
	# test coverage for the self-check
	rm -rf .nyc_output
	rm -rf .nyc_output_text_run
	./node_modules/.bin/nyc bin/text-run --offline
	mv .nyc_output .nyc_output_text_run
	# post-process
	rm -rf .nyc_output
	mkdir .nyc_output
	node bin/cleanse-coverage.js
	nyc report --reporter=lcov
	echo "open 'file://$(pwd)/coverage/lcov-report/index.html' in your browser"
.PHONY: coverage

cuke-api: build
ifndef FILE
	NODE_ENV=test EXOSERVICE_TEST_DEPTH=API node_modules/.bin/cucumber-js --tags '(not @clionly) and (not @todo)' --format progress
else
	DEBUG='*,-babel' NODE_ENV=test EXOSERVICE_TEST_DEPTH=API node_modules/.bin/cucumber-js --tags '(not @clionly) and (not @todo)' $(FILE)
endif

cuke-cli: build
ifndef FILE
	EXOSERVICE_TEST_DEPTH=CLI node_modules/.bin/cucumber-js --tags '(not @apionly) and (not @todo)' --format progress
else
	EXOSERVICE_TEST_DEPTH=CLI node_modules/.bin/cucumber-js --tags '(not @apionly) and (not @todo)' $(FILE)
endif

docs: build
ifndef FILE
	bin/text-run --offline
else
	DEBUG='*,-babel,-text-stream-accumulator,-text-stream-search' bin/text-run --format detailed $(FILE)
endif

features: build
ifndef FILE
	make cuke-api
	make cuke-cli
else
	make cuke-api $(FILE)
	make cuke-cli $(FILE)
endif

# lints all files
lint: lint-js lint-md

# lints the javascript files
lint-js:
	standard -v
	node_modules/.bin/flow
	node_modules/.bin/dependency-lint

# lints markdown files
lint-md:
	remark .

