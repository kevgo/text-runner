# Lerna terminology:
# - dependents = downstreams (my dependents, those that are dependent on me)
# - dependencies = upstreams (my dependencies, those that I depend on)

build:  # builds all codebases
	env FORCE_COLOR=1 yarn exec --silent -- turbo run build --concurrency=100%

rebuild:  # rebuilds all codebases even if their already exist
	env FORCE_COLOR=1 yarn exec --silent -- turbo run build --force --concurrency=100%

clean:  # remove all build artifacts
	env FORCE_COLOR=1 yarn exec --silent -- turbo run clean --concurrency=100%
	find . -name node_modules -type d | xargs rm -rf

cuke:  # runs all E2E tests
	env FORCE_COLOR=1 yarn exec --silent -- turbo run cuke --concurrency=100%

doc:  # runs the documentation tests
	env FORCE_COLOR=1 yarn exec --silent -- turbo run doc --concurrency=100%

fix:  # runs all auto-fixes
	env FORCE_COLOR=1 yarn exec --silent -- turbo run fix --concurrency=100%

help:  # prints all make targets
	cat Makefile | grep '^[^ ]*:' | grep -v '.PHONY' |grep -v '.SILENT' | grep -v help | sed 's/:.*#/#/' | column -s "#" -t

lint:  # lints the root directory
	env FORCE_COLOR=1 yarn exec --silent -- turbo run lint --concurrency=100%

publish: clean rebuild  # publishes all code bases
	yarn exec -- lerna publish from-package

setup:  # prepares the mono-repo for development after cloning
	yarn
	make --no-print-directory build

stats:  # shows code statistics
	find . -type f | grep -v '/node_modules/' | grep -v '/dist/' | grep -v '\./.git/' | grep -v '\./\.vscode/' | grep -v '\./tmp/' | xargs scc

ps:  # pitstop
	env FORCE_COLOR=1 yarn exec --silent -- turbo run fix test --concurrency=100%

test:  # runs all tests for the root directory
	env FORCE_COLOR=1 yarn exec --silent -- turbo run test --concurrency=100%
.PHONY: test

update:  # updates the dependencies for the entire mono-repo
	yarn upgrade-interactive --latest

unit:  # runs all tests
	env FORCE_COLOR=1 yarn exec --silent -- turbo run unit --concurrency=100%


.SILENT:
.DEFAULT_GOAL := help
