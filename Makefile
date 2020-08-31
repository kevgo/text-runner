# Lerna terminology:
# - dependents = downstreams (my dependents, those that are dependent on me)
# - dependencies = upstreams (my dependencies, those that I depend on)
#
# Must diff against origin/master because master on CircleCI is not the same as origin/master.

build-affected:  # builds the codebases affected by changes in this branch
	${CURDIR}/node_modules/.bin/lerna exec --since origin/master --include-dependents --parallel -- make build

build-all:  # builds all the codebases
	${CURDIR}/node_modules/.bin/lerna exec --stream -- make build

build-changed:  # builds the codebases changed in this branch
	${CURDIR}/node_modules/.bin/lerna exec --since origin/master --exclude-dependents --parallel -- make build

build-involved:  # builds all the codebases needed to test the changes in this branch
	${CURDIR}/node_modules/.bin/lerna exec --since origin/master --include-dependents --include-dependencies --stream -- make build

build-open:  # builds the codebases with uncommitted changes
	${CURDIR}/node_modules/.bin/lerna exec --since HEAD --exclude-dependents --parallel -- make build

clean-all:  # Removes all build artifacts
	${CURDIR}/node_modules/.bin/lerna exec --parallel -- make clean

cuke-affected:  # runs the E2E tests for the codebases affected by changes in this branch
	${CURDIR}/node_modules/.bin/lerna exec --since origin/master --include-dependents --parallel -- make cuke

cuke-all:  # runs all E2E tests
	${CURDIR}/node_modules/.bin/lerna exec --parallel -- make cuke-lerna

cuke-changed:  # runs the E2E tests of codebases changed in this branch
	${CURDIR}/node_modules/.bin/lerna exec --since origin/master --exclude-dependents --parallel -- make cuke

cuke-open:  # runs the E2E tests of codebases with uncommitted changes
	${CURDIR}/node_modules/.bin/lerna exec --since HEAD --exclude-dependents --parallel -- make cuke

docs:  # runs the documentation tests
	echo documentation tests for root dir ...
	${CURDIR}/text-runner/bin/text-run --offline --format progress "*.md"

docs-affected:  # runs the documentation tests for the codebases affected by changes in this branch
	${CURDIR}/node_modules/.bin/lerna exec --since origin/master --include-dependents --parallel -- make docs

docs-all:  # runs all documentation tests
	${CURDIR}/node_modules/.bin/lerna exec --parallel -- make docs

docs-changed:  # runs the documentation tests of codebases changed in this branch
	${CURDIR}/node_modules/.bin/lerna exec --since origin/master --exclude-dependents --parallel -- make docs

docs-open:  # runs the documentation tests of codebases with uncommitted changes
	${CURDIR}/node_modules/.bin/lerna exec --since HEAD --exclude-dependents --parallel -- make docs

fix:  # auto-fixes the root directory
	echo fixing root dir ...
	${CURDIR}/node_modules/.bin/prettier --write .

fix-affected:  # runs the auto-fixes for the codebases affected by changes in this branch
	${CURDIR}/node_modules/.bin/lerna exec --since origin/master --include-dependents --parallel -- make fix

fix-all:  # runs all auto-fixes
	${CURDIR}/node_modules/.bin/lerna exec --parallel -- make fix

fix-changed:  # runs the auto-fixes of codebases changed in this branch
	${CURDIR}/node_modules/.bin/lerna exec --since origin/master --exclude-dependents --parallel -- make fix

fix-open:  # runs the auto-fixes of codebases with uncommitted changes
	${CURDIR}/node_modules/.bin/lerna exec --since HEAD --exclude-dependents --parallel -- make fix

help:  # prints all make targets
	cat Makefile | grep '^[^ ]*:' | grep -v '.PHONY' | grep -v help | sed 's/:.*#/#/' | column -s "#" -t

lint:  # lints the root directory
	echo linting root dir ...
	${CURDIR}/node_modules/.bin/prettier -l '.'

lint-affected:  # runs the linters for the codebases affected by changes in this branch
	${CURDIR}/node_modules/.bin/lerna exec --since origin/master --include-dependents --parallel -- make lint

lint-all:  # runs all linters
	${CURDIR}/node_modules/.bin/lerna exec --parallel -- make lint

lint-changed:  # runs the linters of codebases changed in this branch
	${CURDIR}/node_modules/.bin/lerna exec --since origin/master --exclude-dependents --parallel -- make lint

lint-open:  # runs the linters of codebases with uncommitted changes
	${CURDIR}/node_modules/.bin/lerna exec --since HEAD --exclude-dependents --parallel -- make lint

list-affected:  # displays the codebases affected by changes in the current branch
	${CURDIR}/node_modules/.bin/lerna exec --since origin/master --include-dependents -- pwd

list-all:  # displays all codebases
	${CURDIR}/node_modules/.bin/lerna exec -- pwd

list-changed:  # displays the codebases changed in the current branch
	${CURDIR}/node_modules/.bin/lerna exec --since origin/master --exclude-dependents -- pwd

list-involved:  # builds all the codebases needed to test the changes in this branch
	${CURDIR}/node_modules/.bin/lerna exec --since origin/master --include-dependents --include-dependencies -- pwd

list-open:  # displays the codebases with uncommitted changes
	${CURDIR}/node_modules/.bin/lerna exec --since HEAD --exclude-dependents -- pwd

setup:  # prepares the mono-repo for development after cloning
	find . -type d -name node_modules | xargs rm -rf
	yarn
	make build-all

test: lint  # runs all tests for the root directory

test-affected:  # runs all tests for the codebases affected by changes in this branch
	${CURDIR}/node_modules/.bin/lerna exec --since origin/master --include-dependents --parallel -- make test-lerna

test-all:  # runs all tests
	${CURDIR}/node_modules/.bin/lerna exec --parallel --stream -- make test-lerna

test-changed:  # runs all tests of codebases changed in this branch
	${CURDIR}/node_modules/.bin/lerna exec --since origin/master --exclude-dependents --parallel -- make test-lerna

test-open:  # runs all tests of codebases with uncommitted changes
	${CURDIR}/node_modules/.bin/lerna exec --since HEAD --exclude-dependents --parallel -- make test-lerna

update-all:  # updates the dependencies for the entire mono-repo
	yarn upgrade-interactive --latest

unit-all:  # runs all tests
	${CURDIR}/node_modules/.bin/lerna exec --parallel --stream -- make unit

.SILENT:
