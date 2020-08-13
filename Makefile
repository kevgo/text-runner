build:
	@echo root folder build ...

build-all:  # builds all the code bases
	@(cd text-runner && make --no-print-directory build)
	@(cd textrun-action && make --no-print-directory build)
	@(cd textrun-javascript && make --no-print-directory build)
	@(cd textrun-make && make --no-print-directory build)
	@(cd textrun-npm && make --no-print-directory build)
	@(cd textrun-shell && make --no-print-directory build)

build-changed:  # builds all codebases with changes
	@git diff --name-only master | tools/workspaces/bin/workspaces | xargs -I {} bash -c 'cd {} && make --no-print-directory build'

clean-all:  # Removes all build artifacts
	@(cd text-runner && make --no-print-directory clean)
	@(cd textrun-action && make --no-print-directory clean)
	@(cd textrun-javascript && make --no-print-directory clean)
	@(cd textrun-make && make --no-print-directory clean)
	@(cd textrun-npm && make --no-print-directory clean)
	@(cd textrun-shell && make --no-print-directory clean)

cuke-all:  # runs all E2E tests
	@(cd text-runner && make --no-print-directory cuke)
	@(cd textrun-javascript && make --no-print-directory cuke)
	@(cd textrun-make && make --no-print-directory cuke)
	@(cd textrun-npm && make --no-print-directory cuke)
	@(cd textrun-shell && make --no-print-directory cuke)

cuke-smoke-win:  # runs the smoke tests
	@(cd text-runner && make build && ${CURDIR}/node_modules/.bin/cucumber-js --tags '@smoke' --format progress)

docs:  # runs the documentation tests
	@echo documentation tests for root dir ...
	@${CURDIR}/text-runner/bin/text-run --offline --format progress "*.md"

docs-all: docs  # runs the documentation tests for all codebases
	@(cd text-runner && make --no-print-directory docs)
	@(cd textrun-action && make --no-print-directory docs)
	@(cd textrun-javascript && make --no-print-directory docs)
	@(cd textrun-make && make --no-print-directory docs)
	@(cd textrun-npm && make --no-print-directory docs)
	@(cd textrun-shell && make --no-print-directory docs)

fix:  # auto-fixes the root directory
	@echo fixing root dir ...
	${CURDIR}/node_modules/.bin/prettier --write .

fix-all: fix  # auto-fixes the entire mono-repo
	@(cd text-runner && make --no-print-directory fix)
	@(cd textrun-action && make --no-print-directory fix)
	@(cd textrun-javascript && make --no-print-directory fix)
	@(cd textrun-make && make --no-print-directory fix)
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
	@(cd textrun-make && make --no-print-directory lint)
	@(cd textrun-npm && make --no-print-directory lint)
	@(cd textrun-shell && make --no-print-directory lint)

setup:  # prepares the mono-repo for development after cloning
	@yarn
	@make --no-print-directory build-all

test: test-all  # shorter name for test-all

test-all:  # runs all tests
	@(cd text-runner && make --no-print-directory test)
	@(cd textrun-action && make --no-print-directory test)
	@(cd textrun-javascript && make --no-print-directory test)
	@(cd textrun-make && make --no-print-directory test)
	@(cd textrun-npm && make --no-print-directory test)
	@(cd textrun-shell && make --no-print-directory test)

test-changed:  # tests only the changed codebases


update-all:  # updates the dependencies for the entire mono-repo
	@(cd text-runner && yarn upgrade --latest)
	@(cd textrun-action && yarn upgrade --latest)
	@(cd textrun-javascript && yarn upgrade --latest)
	@(cd textrun-make && yarn upgrade --latest)
	@(cd textrun-npm && yarn upgrade --latest)
	@(cd textrun-shell && yarn upgrade --latest)
