# dev tooling and versions
RUN_THAT_APP_VERSION = 0.14.0

YARN_ARGS = FORCE_COLOR=1
TURBO_ARGS = --concurrency=100%

build:  # builds all codebases
	env $(YARN_ARGS) yarn exec --silent -- turbo run build $(TURBO_ARGS)

cuke:  # runs all E2E tests
	env $(YARN_ARGS) yarn exec --silent -- turbo run cuke $(TURBO_ARGS)

doc:  # runs the documentation tests
	env $(YARN_ARGS) yarn exec --silent -- text-runner
	env $(YARN_ARGS) yarn exec --silent -- turbo run doc $(TURBO_ARGS)

fix:  # runs all auto-fixes
	yarn exec --silent -- dprint fmt
	yarn exec --silent -- sort-package-json --quiet
	env $(YARN_ARGS) yarn exec --silent -- turbo run fix $(TURBO_ARGS)

help:  # prints all make targets
	cat Makefile | grep '^[^ ]*:' | grep -v '.PHONY' | grep -v '.SILENT' | grep -v help | grep -v '^tools/rta' | sed 's/:.*#/#/' | column -s "#" -t

lint:  # lints the root directory
	env $(YARN_ARGS) yarn exec --silent -- turbo run lint $(TURBO_ARGS)

publish: reset  # publishes all code bases
	yarn exec -- lerna publish from-package

setup:  # prepares the mono-repo for development after cloning
	yarn
	make --no-print-directory build

reset:  # fresh setup
	echo "deleting turbo cache" && find . -name .turbo -type d | xargs rm -rf
	echo "deleting node_modules" && find . -name node_modules -type d | xargs rm -rf
	echo "deleting dist" && find . -name dist -type d | xargs rm -rf
	make --no-print-directory setup

stats: tools/rta@${RUN_THAT_APP_VERSION}  # shows code statistics
	find . -type f | grep -v '/node_modules/' | grep -v '/dist/' | grep -v '\./.git/' | grep -v '\./\.vscode/' | grep -v '\./tmp/' | xargs tools/rta scc

test:  # runs all tests
	env $(YARN_ARGS) yarn exec --silent -- turbo run lint unit cuke doc $(TURBO_ARGS)
.PHONY: test

update:  # updates the dependencies for the entire mono-repo
	yarn upgrade-interactive --latest

unit:  # runs all tests
	env $(YARN_ARGS) yarn exec --silent -- turbo run unit $(TURBO_ARGS)


# --- HELPER TARGETS --------------------------------------------------------------------------------------------------------------------------------

tools/rta@${RUN_THAT_APP_VERSION}:
	@rm -f tools/rta* tools/rta
	@(cd tools && curl https://raw.githubusercontent.com/kevgo/run-that-app/main/download.sh | sh)
	@mv tools/rta tools/rta@${RUN_THAT_APP_VERSION}
	@ln -s rta@${RUN_THAT_APP_VERSION} tools/rta

.SILENT:
.DEFAULT_GOAL := help
