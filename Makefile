.DEFAULT_GOAL := spec

# platform-specificity
ifdef ComSpec
	/ := $(strip \)
else
	/ := /
endif

build: clean    # builds for the current platform
	@node_modules$/.bin$/tsc -p .

clean:   # Removes all build artifacts
	@rm -rf dist
	@rm -rf .nyc_output*

coverage-build:   # builds the code base with code coverage measurements baked in
	./node_modules/.bin/babel src -d dist --extensions ".ts"

coverage-tests:  # test coverage for unit tests
	BABEL_ENV=test_coverage ./node_modules/.bin/nyc ./node_modules/.bin/mocha "src/**/*-test.js" --reporter dot
	mv .nyc_output .nyc_output_tests

coverage-cuke-other:   # test coverage for CLI specs
	rm -rf .nyc_output_cli_other
	NODE_ENV=coverage node_modules/.bin/cucumber-js --tags '(not @todo)' 'features/!(actions|commands|images|formatters|tag-types)'
	mv .nyc_output_cli .nyc_output_cuke_other

coverage-cuke-actions:   # test coverage for CLI specs
	rm -rf .nyc_output_cli
	NODE_ENV=coverage node_modules/.bin/cucumber-js --tags '(not @todo)' 'features/+(actions|images)'
	mv .nyc_output_cli .nyc_output_cuke_actions

coverage-cuke-tagtypes:   # test coverage for CLI specs
	rm -rf .nyc_output_cli
	NODE_ENV=coverage node_modules/.bin/cucumber-js --tags '(not @todo)' 'features/+(tag-types|commands|formatters)'
	mv .nyc_output_cli .nyc_output_cuke_tagtypes

coverage-docs:  # test coverage for the self-check
	rm -rf .nyc_output_text_run
	./node_modules/.bin/nyc bin/text-run --offline
	mv .nyc_output .nyc_output_text_run

coverage-merge: # merge all coverage results together
	rm -rf .nyc_output
	mkdir .nyc_output
	ls -1 .nyc_output_tests | cat -n | while read n f; do cp ".nyc_output_tests/$$f" ".nyc_output/tests_$$n.json"; done
	ls -1 .nyc_output_text_run | cat -n | while read n f; do cp ".nyc_output_text_run/$$f" ".nyc_output/textrun_$$n.json"; done
	find .nyc_output_cuke_other -type f | cat -n | while read n f; do cp "$$f" ".nyc_output/cli_other_$$n.json"; done
	find .nyc_output_cuke_actions -type f | cat -n | while read n f; do cp "$$f" ".nyc_output/cli_actions_$$n.json"; done
	find .nyc_output_cuke_tagtypes -type f | cat -n | while read n f; do cp "$$f" ".nyc_output/cli_tagtypes_$$n.json"; done

coverage-html:  # render test coverage as a HTML report
	node_modules/.bin/nyc report --reporter=lcov
	@echo "open 'file://$(shell pwd)/coverage/lcov-report/index.html' in your browser"

coverage-send:  # sends the coverage to coveralls.io
	node_modules/.bin/nyc report --reporter=text-lcov | node_modules/.bin/coveralls

coverage: coverage-build coverage-tests coverage-cli coverage-docs   # measures code coverage
.PHONY: coverage

cuke: build   # runs the feature specs
ifndef FILE
	@node_modules/.bin/cucumber-js --tags "(not @todo)" --format progress
else
	@node_modules/.bin/cucumber-js --tags "(not @todo)" $(FILE)
endif

cuke-other:   # test coverage for CLI specs
	node_modules/.bin/cucumber-js --tags "(not @todo)" "features/!(actions|commands|images|formatters|tag-types)"

cuke-actions:   # test coverage for CLI specs
	node_modules/.bin/cucumber-js --tags "(not @todo)" "features/+(actions|images)"

cuke-tagtypes:   # test coverage for CLI specs
	node_modules/.bin/cucumber-js --tags "(not @todo)" "features/+(tag-types|commands|formatters)"

cuke-offline: build   # runs the feature specs that don't need an online connection
	@EXOSERVICE_TEST_DEPTH=CLI node_modules/.bin/cucumber-js --tags "(not @online) and (not @todo)" --format progress

cuke-win:     # runs the feature specs on Windows
ifndef FILE
	@node_modules\.bin\cucumber-js --tags '(not @todo) and (not @skipWindows)' --format progress
else
	@node_modules\.bin\cucumber-js --tags "(not @todo) and (not @skipWindows)" $(FILE)
endif

deploy: build  # deploys a new version to npmjs.com
	semantic-release

docs: build   # runs the documentation tests
ifndef FILE
	@bin$/text-run --offline
else
	@DEBUG='*,-babel,-text-stream-accumulator,-text-stream-search' bin/text-run --format detailed $(FILE)
endif

fix:  # runs the fixers
	node_modules$/.bin$/tslint --project tsconfig.json --fix
	node_modules$/.bin$/prettier --write 'src/**/*.ts'
	node_modules$/.bin$/prettier --write 'features/**/*.ts'
	node_modules$/.bin$/prettier --write '*.md'
	node_modules$/.bin$/prettier --write 'documentation/**/*.md'
	node_modules$/.bin$/prettier --write '*.yml'

help:   # prints all make targets
	@cat Makefile | grep '^[^ ]*:' | grep -v '.PHONY' | grep -v help | sed 's/:.*#/#/' | column -s "#" -t

lint: lintjs lintmd lintyml   # lints all files

lintjs: build   # lints the javascript files
	node_modules$/.bin$/tsc --noEmit
	node_modules$/.bin$/tslint --project tsconfig.json
	node_modules/.bin/prettier -l "src/**/*.ts"
	node_modules/.bin/prettier -l "features/**/*.ts"

lintmd:   # lints markdown files
	node_modules/.bin/prettier -l "*.md"
	# node_modules/.bin/prettier -l "documentation/**/*.md"
	node_modules$/.bin$/remark .

lintyml:   # lints yml files
	node_modules/.bin/prettier -l "*.yml"

setup:   # sets up the installation on this machine
	go get github.com/tj/node-prune
	rm -rf node_modules
	yarn install
	node-prune

spec: lint tests cuke docs   # runs all tests

tests:   # runs the unit tests
	@node_modules/.bin/mocha "src/**/*-test.ts"

travis: lint coverage   # the set of tests running on Travis-CI

upgrade:   # updates the dependencies to their latest versions
	yarn upgrade-interactive
