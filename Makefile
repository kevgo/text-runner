# Lerna terminology:
# - dependents = downstreams (my dependents, those that are dependent on me)
# - dependencies = upstreams (my dependencies, those that I depend on)
#
# Must diff against origin/master because master on CircleCI is not the same as origin/master.

build-affected:  # builds the codebases affected by changes in this branch
	${CURDIR}/node_modules/.bin/lerna exec --since origin/master --include-dependents --parallel -- make --no-print-directory build

build-all:  # builds all the codebases
	${CURDIR}/node_modules/.bin/lerna exec --stream -- make --no-print-directory build

build-changed:  # builds the codebases changed in this branch
	${CURDIR}/node_modules/.bin/lerna exec --since origin/master --exclude-dependents --parallel -- make --no-print-directory build

build-involved:  # builds all the codebases needed to test the changes in this branch
	${CURDIR}/node_modules/.bin/lerna exec --since origin/master --include-dependents --include-dependencies --stream -- make --no-print-directory build

build-open:  # builds the codebases with uncommitted changes
	${CURDIR}/node_modules/.bin/lerna exec --since HEAD --exclude-dependents --parallel -- make --no-print-directory build

clean-all:  # Removes all build artifacts
	${CURDIR}/node_modules/.bin/lerna exec --parallel -- make --no-print-directory clean

cuke-affected:  # runs the E2E tests for the codebases affected by changes in this branch
	${CURDIR}/node_modules/.bin/lerna exec --since origin/master --include-dependents --parallel -- make --no-print-directory cuke

cuke-all:  # runs all E2E tests
	${CURDIR}/node_modules/.bin/lerna exec --parallel -- make --no-print-directory cuke-lerna

cuke-changed:  # runs the E2E tests of codebases changed in this branch
	${CURDIR}/node_modules/.bin/lerna exec --since origin/master --exclude-dependents --parallel -- make --no-print-directory cuke

cuke-open:  # runs the E2E tests of codebases with uncommitted changes
	${CURDIR}/node_modules/.bin/lerna exec --since HEAD --exclude-dependents --parallel -- make --no-print-directory cuke

doc:  # runs the documentation tests
	echo documentation tests for root dir ...
	${CURDIR}/text-runner-cli/bin/text-run --format=progress "*.md"

doc-affected:  # runs the documentation tests for the codebases affected by changes in this branch
	${CURDIR}/node_modules/.bin/lerna exec --since origin/master --include-dependents --parallel -- make --no-print-directory doc

doc-all:  # runs all documentation tests
	${CURDIR}/node_modules/.bin/lerna exec --parallel -- make --no-print-directory doc

doc-changed:  # runs the documentation tests of codebases changed in this branch
	${CURDIR}/node_modules/.bin/lerna exec --since origin/master --exclude-dependents --parallel -- make --no-print-directory doc

doc-open:  # runs the documentation tests of codebases with uncommitted changes
	${CURDIR}/node_modules/.bin/lerna exec --since HEAD --exclude-dependents --parallel -- make --no-print-directory doc

fix:  # auto-fixes the root directory
	echo fixing root dir ...
	${CURDIR}/node_modules/.bin/prettier --write .

fix-affected:  # runs the auto-fixes for the codebases affected by changes in this branch
	${CURDIR}/node_modules/.bin/lerna exec --since origin/master --include-dependents --parallel -- make --no-print-directory fix

fix-all:  # runs all auto-fixes
	make fix
	${CURDIR}/node_modules/.bin/lerna exec --parallel -- make --no-print-directory fix

fix-changed:  # runs the auto-fixes of codebases changed in this branch
	${CURDIR}/node_modules/.bin/lerna exec --since origin/master --exclude-dependents --parallel -- make --no-print-directory fix

fix-open:  # runs the auto-fixes of codebases with uncommitted changes
	${CURDIR}/node_modules/.bin/lerna exec --since HEAD --exclude-dependents --parallel -- make --no-print-directory fix

help:  # prints all make targets
	cat Makefile | grep '^[^ ]*:' | grep -v '.PHONY' | grep -v help | sed 's/:.*#/#/' | column -s "#" -t

lint:  # lints the root directory
	echo linting root dir ...
	${CURDIR}/node_modules/.bin/prettier -l '.'

lint-affected:  # runs the linters for the codebases affected by changes in this branch
	${CURDIR}/node_modules/.bin/lerna exec --since origin/master --include-dependents --parallel -- make --no-print-directory lint

lint-all:  # runs all linters
	make lint
	${CURDIR}/node_modules/.bin/lerna exec --parallel -- make --no-print-directory lint

lint-changed:  # runs the linters of codebases changed in this branch
	${CURDIR}/node_modules/.bin/lerna exec --since origin/master --exclude-dependents --parallel -- make --no-print-directory lint

lint-open:  # runs the linters of codebases with uncommitted changes
	${CURDIR}/node_modules/.bin/lerna exec --since HEAD --exclude-dependents --parallel -- make --no-print-directory lint

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

publish-all: clean-all build-all  # publishes all code bases
	${CURDIR}/node_modules/.bin/lerna publish from-package

setup:  # prepares the mono-repo for development after cloning
	find . -type d -name node_modules | xargs rm -rf
	yarn
	make build-all

stats:  # shows code statistics
	find . -type f | grep -v '/node_modules/' | grep -v '/dist/' | grep -v '\./.git/' | grep -v '\./\.vscode/' | grep -v '\./tmp/' | xargs scc

test: lint  # runs all tests for the root directory

test-affected:  # runs all tests for the codebases affected by changes in this branch
	${CURDIR}/node_modules/.bin/lerna exec --since origin/master --include-dependents --parallel -- make --no-print-directory test-lerna

test-affected-ci:  # runs all tests for the codebases affected by changes in this branch (which only provides 2 cores but reports 36 and kills processes randomly if they use more)
	${CURDIR}/node_modules/.bin/lerna exec --since origin/master --include-dependents --parallel --concurrency=2 -- make --no-print-directory test-lerna

test-all:  # runs all tests
	${CURDIR}/node_modules/.bin/lerna exec --parallel --stream -- make --no-print-directory test-lerna

test-all-ci:  # runs all tests on CircleCI (which only provides 2 cores but reports 36 and kills processes randomly if they use more)
	${CURDIR}/node_modules/.bin/lerna exec --parallel --concurrency=2 --stream -- make --no-print-directory test-lerna

test-changed:  # runs all tests of codebases changed in this branch
	${CURDIR}/node_modules/.bin/lerna exec --since origin/master --exclude-dependents --parallel -- make --no-print-directory test-lerna

test-open:  # runs all tests of codebases with uncommitted changes
	${CURDIR}/node_modules/.bin/lerna exec --since HEAD --exclude-dependents --parallel -- make --no-print-directory test-lerna

update-all:  # updates the dependencies for the entire mono-repo
	yarn upgrade-interactive --latest

unit-all:  # runs all tests
	${CURDIR}/node_modules/.bin/lerna exec --parallel --stream -- make --no-print-directory unit

.SILENT:
