build-affected:  # builds the codebases affected by changes in this branch
	@git diff --name-only master | tools/workspaces/bin/workspaces affected | xargs -I {} bash -c 'cd {} && make --no-print-directory build || exit 255'

build-all:  # builds all the codebases
	@${CURDIR}/node_modules/.bin/lerna exec -- make --no-print-directory build

build-changed:  #builds the codebases changed in this branch
	@${CURDIR}/node_modules/.bin/lerna exec --since master --exclude-dependents -- make --no-print-directory build

clean-all:  # Removes all build artifacts
	@tools/workspaces/bin/workspaces all | xargs -I {} bash -c 'cd {} && make --no-print-directory clean || exit 255'

cuke-all:  # runs all E2E tests
	@tools/workspaces/bin/workspaces all | xargs -I {} bash -c 'cd {} && make --no-print-directory cuke || exit 255'

cuke-smoke-win:  # runs the smoke tests
	@(cd text-runner && make build && ${CURDIR}/node_modules/.bin/cucumber-js --tags '@smoke' --format progress)

docs:  # runs the documentation tests
	@echo documentation tests for root dir ...
	@${CURDIR}/text-runner/bin/text-run --offline --format progress "*.md"

docs-affected:  # runs the documentation tests for the codebases affected by changes in the current branch
	@git diff --name-only master | tools/workspaces/bin/workspaces affected | xargs -I {} bash -c 'cd {} && make --no-print-directory docs || exit 255'

docs-all: docs  # runs the documentation tests for all codebases
	@tools/workspaces/bin/workspaces all | xargs -I {} bash -c 'cd {} && make --no-print-directory docs || exit 255'

docs-changed:  # runs the documentation tests for the codebases changed in the current branch
	@git diff --name-only master | tools/workspaces/bin/workspaces changed | xargs -I {} bash -c 'cd {} && make --no-print-directory docs || exit 255'

fix:  # auto-fixes the root directory
	@echo fixing root dir ...
	${CURDIR}/node_modules/.bin/prettier --write .

fix-all: fix  # auto-fixes the entire mono-repo
	@tools/workspaces/bin/workspaces all | xargs -I {} bash -c 'cd {} && make --no-print-directory fix || exit 255'

fix-affected:  # runs the documentation tests for the codebases affected by changes in the current branch
	@git diff --name-only master | tools/workspaces/bin/workspaces affected | xargs -I {} bash -c 'cd {} && make --no-print-directory fix || exit 255'

fix-changed:  # runs the documentation tests for the codebases changed in the current branch
	@git diff --name-only master | tools/workspaces/bin/workspaces changed | xargs -I {} bash -c 'cd {} && make --no-print-directory fix || exit 255'

help:  # prints all make targets
	@cat Makefile | grep '^[^ ]*:' | grep -v '.PHONY' | grep -v help | sed 's/:.*#/#/' | column -s "#" -t

lint:  # lints the root directory
	@echo linting root dir ...
	@${CURDIR}/node_modules/.bin/remark . --quiet &
	@${CURDIR}/node_modules/.bin/prettier -l '.'

lint-all: lint  # lints the entire mono-repo
	@tools/workspaces/bin/workspaces all | xargs -I {} bash -c 'cd {} && make --no-print-directory lint || exit 255'

lint-affected:  # lints the workspaces affected by changes in the current branch
	@git diff --name-only master | tools/workspaces/bin/workspaces affected | xargs -I {} bash -c 'cd {} && make --no-print-directory lint || exit 255'

lint-changed:  # lints the workspaces changed in the current branch
	@git diff --name-only master | tools/workspaces/bin/workspaces changed | xargs -I {} bash -c 'cd {} && make --no-print-directory lint || exit 255'

list-affected:  # displays the workspaces affected by changes in the current branch
	@git diff --name-only master | tools/workspaces/bin/workspaces affected

list-all:  # displays all workspaces
	@tools/workspaces/bin/workspaces all

list-changed:  # displays the workspaces changed in the current branch
	@git diff --name-only master | tools/workspaces/bin/workspaces changed

setup:  # prepares the mono-repo for development after cloning
	@find . -type d -name node_modules | xargs rm -rf
	@yarn
	@make --no-print-directory build-all

test: lint  # runs all tests for the root directory

test-all:  # runs all tests
	@tools/workspaces/bin/workspaces all | xargs -I {} bash -c 'cd {} && make --no-print-directory test || exit 255'

test-affected:  # tests only the codebases affected by changes in the current branch
	@git diff --name-only master | tools/workspaces/bin/workspaces affected | xargs -I {} bash -c 'cd {} && make --no-print-directory test || exit 255'

test-changed:  # tests only the codebases changed in the current branch
	@git diff --name-only master | tools/workspaces/bin/workspaces changed | xargs -I {} bash -c 'cd {} && make --no-print-directory test || exit 255'

update-all:  # updates the dependencies for the entire mono-repo
	@tools/workspaces/bin/workspaces all | xargs -I {} bash -c 'cd {} && yarn upgrade --latest || exit 255'
