.DEFAULT_GOAL := spec

# platform-specificity
ifdef ComSpec
	/ := $(strip \)
else
	/ := /
endif

build: clean    # builds for the current platform
	@node_modules$/.bin$/tsc -p tsconfig-build.json

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
	@node_modules/.bin/cucumber-js --tags "(not @todo)" --format progress --parallel `node -e 'console.log(os.cpus().length)'`

cuke-other:   # test coverage for CLI specs
	node_modules/.bin/cucumber-js --tags "(not @todo)" "features/!(actions|commands|images|formatters|tag-types)"

cuke-actions:   # test coverage for CLI specs
	node_modules/.bin/cucumber-js --tags "(not @todo)" "features/+(actions|images)"

cuke-tagtypes:   # test coverage for CLI specs
	node_modules/.bin/cucumber-js --tags "(not @todo)" "features/+(tag-types|commands|formatters)"

cuke-offline: build   # runs the feature specs that don't need an online connection
	@node_modules/.bin/cucumber-js --tags "(not @online) and (not @todo)" --format progress --parallel `node -e 'console.log(os.cpus().length)'`

cuke-smoke-win:  # runs the smoke tests
	@node_modules\.bin\cucumber-js --tags '@smoke' --format progress

cuke-win:     # runs the feature specs on Windows
ifndef FILE
	@node_modules\.bin\cucumber-js --tags '(not @todo) and (not @skipWindows)' --format progress
else
	@node_modules\.bin\cucumber-js --tags "(not @todo) and (not @skipWindows)" $(FILE)
endif

docs: build   # runs the documentation tests
	@bin$/text-run static --offline --format dot
	@echo
	@bin$/text-run dynamic --format progress

fix:  # runs the fixers
	node_modules$/.bin$/tslint --project tsconfig.json --fix
	@find . -type f \( \
	       -path './src/**/*.ts' -o \
				 -path './features/**/*.ts' -o \
				 -path './text-run/*.js' -o \
				 -path './documentation/**/*.js' -o \
				 -path './*.md' -o \
				 -path './*.yml' -o \
				 -name '*node_modules*' -prune \) | \
		grep -v '^./tmp/' | \
		grep -v node_modules | \
		grep -v documentation/built-in-actions/run_javascript.md | \
		grep -v documentation/built-in-actions/start_stop_process.md | \
		grep -v documentation/built-in-actions/verify_console_command_output.md | \
		grep -v documentation/built-in-actions/verify_source_file_content.md | \
		grep -v documentation/built-in-actions/verify_workspace_file_content.md | \
		xargs node_modules/.bin/pprettier --write

help:   # prints all make targets
	@cat Makefile | grep '^[^ ]*:' | grep -v '.PHONY' | grep -v help | sed 's/:.*#/#/' | column -s "#" -t

lint: # lints all files
	node_modules$/.bin$/tsc -p tsconfig.json &
	node_modules$/.bin$/tslint --project tsconfig-build.json &
	node_modules$/.bin$/remark . --quiet &
	@find . -type f \( \
	       -path './src/**/*.ts' -o \
				 -path './features/**/*.ts' -o \
				 -path './text-run/*.js' -o \
				 -path './documentation/**/*.js' -o \
				 -path './*.md' -o \
				 -path './*.yml' -o \
				 -name '*node_modules*' -prune \) | \
		grep -v '^./tmp/' | \
		grep -v node_modules | \
		grep -v documentation/how-it-works.md | \
		grep -v documentation/built-in-actions/run_console_command.md | \
		grep -v documentation/built-in-actions/run_javascript.md | \
		grep -v documentation/built-in-actions/start_stop_process.md | \
		grep -v documentation/built-in-actions/validate_javascript.md | \
		grep -v documentation/built-in-actions/verify_console_command_output.md | \
		grep -v documentation/built-in-actions/verify_npm_install.md | \
		grep -v documentation/built-in-actions/verify_npm_global_command.md | \
		grep -v documentation/built-in-actions/verify_source_file_content.md | \
		grep -v documentation/built-in-actions/verify_workspace_file_content.md | \
		grep -v fixtures | \
		xargs node_modules/.bin/pprettier --check

test: lint unit cuke docs   # runs all tests
.PHONY: test

test-offline: lint unit cuke-offline docs   # runs all tests that don't need an online connection

unit:   # runs the unit tests
	@node_modules/.bin/mocha --reporter dot "src/**/*-test.ts"
