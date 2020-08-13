build:
	@echo root folder build ...

build-all:  # builds all the codebases
	@(cd text-runner && make --no-print-directory build)
	@(cd textrun-action && make --no-print-directory build)
	@(cd textrun-javascript && make --no-print-directory build)
	@(cd textrun-make && make --no-print-directory build)
	@(cd textrun-npm && make --no-print-directory build)
	@(cd textrun-shell && make --no-print-directory build)

build-affected:  # builds the codebases affected by changes in this branch
	@git diff --name-only master | tools/workspaces/bin/workspaces affected | xargs -I {} bash -c 'cd {} && make --no-print-directory build || exit 255'

build-changed:  #builds the codebases changed in this branch
	@git diff --name-only master | tools/workspaces/bin/workspaces changed | xargs -I {} bash -c 'cd {} && make --no-print-directory build || exit 255'

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

docs-affected:  # runs the documentation tests for the codebases affected by changes in the current branch
	@git diff --name-only master | tools/workspaces/bin/workspaces affected | xargs -I {} bash -c 'cd {} && make --no-print-directory lint || exit 255'

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

fix-affected:  # runs the documentation tests for the codebases affected by changes in the current branch
	@git diff --name-only master | tools/workspaces/bin/workspaces affected | xargs -I {} bash -c 'cd {} && make --no-print-directory fix || exit 255'

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

lint-affected:  # lints the workspaces affected by changes in the current branch
	@git diff --name-only master | tools/workspaces/bin/workspaces affected | xargs -I {} bash -c 'cd {} && make --no-print-directory lint || exit 255'

list-affected:  # displays the workspaces affected by changes in the current branch
	@git diff --name-only master | tools/workspaces/bin/workspaces affected

setup:  # prepares the mono-repo for development after cloning
	@find . -type d -name node_modules | xargs rm -rf
	@yarn
	@make --no-print-directory build-all

test: lint  # runs all tests for the root directory

test-all:  # runs all tests
	@(cd text-runner && make --no-print-directory test)
	@(cd textrun-action && make --no-print-directory test)
	@(cd textrun-javascript && make --no-print-directory test)
	@(cd textrun-make && make --no-print-directory test)
	@(cd textrun-npm && make --no-print-directory test)
	@(cd textrun-shell && make --no-print-directory test)

test-affected:  # tests only the changed codebases
	@git diff --name-only master | tools/workspaces/bin/workspaces affected | xargs -I {} bash -c 'cd {} && make --no-print-directory test || exit 255'

update-all:  # updates the dependencies for the entire mono-repo
	@(cd text-runner && yarn upgrade --latest)
	@(cd textrun-action && yarn upgrade --latest)
	@(cd textrun-javascript && yarn upgrade --latest)
	@(cd textrun-make && yarn upgrade --latest)
	@(cd textrun-npm && yarn upgrade --latest)
	@(cd textrun-shell && yarn upgrade --latest)
