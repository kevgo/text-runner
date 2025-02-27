# dev tooling and versions
RUN_THAT_APP_VERSION = 0.13.0

TURBO_ARGS = --concurrency=1

build:  # builds all codebases
	npm run --workspaces --if-present build

clean:  # remove all build artifacts
	npm run clean $(TURBO_ARGS)
	find . -name .turbo -type d | xargs rm -rf
	find . -name node_modules -type d | xargs rm -rf

cuke:  # runs all E2E tests
	npm exec --silent -- turbo run cuke $(TURBO_ARGS)

doc:  # runs the documentation tests
	npm exec --silent -- turbo run doc $(TURBO_ARGS)

fix:  # runs all auto-fixes
	npm exec --silent -- turbo run fix $(TURBO_ARGS)

help:  # prints all make targets
	cat Makefile | grep '^[^ ]*:' | grep -v '.PHONY' | grep -v '.SILENT' | grep -v help | grep -v '^tools/rta' | sed 's/:.*#/#/' | column -s "#" -t

lint:  # lints the root directory
	npm exec --silent -- turbo run lint $(TURBO_ARGS)

publish: clean setup  # publishes all code bases
	npm exec -- lerna publish from-package

setup:  # prepares the mono-repo for development after cloning
	npm install
	make --no-print-directory build

stats: tools/rta@${RUN_THAT_APP_VERSION}  # shows code statistics
	find . -type f | grep -v '/node_modules/' | grep -v '/dist/' | grep -v '\./.git/' | grep -v '\./\.vscode/' | grep -v '\./tmp/' | xargs tools/rta scc

ps:  # pitstop
	npm exec --silent -- turbo run fix test $(TURBO_ARGS)

test:  # runs all tests cached
	npm exec --silent -- turbo run test $(TURBO_ARGS)
.PHONY: test

update:  # updates the dependencies for the entire mono-repo
	npm upgrade-interactive --latest

unit:  # runs all tests
	npm exec --silent -- turbo run unit $(TURBO_ARGS)


# --- HELPER TARGETS --------------------------------------------------------------------------------------------------------------------------------

tools/rta@${RUN_THAT_APP_VERSION}:
	@rm -f tools/rta* tools/rta
	@(cd tools && curl https://raw.githubusercontent.com/kevgo/run-that-app/main/download.sh | sh)
	@mv tools/rta tools/rta@${RUN_THAT_APP_VERSION}
	@ln -s rta@${RUN_THAT_APP_VERSION} tools/rta

.SILENT:
.DEFAULT_GOAL := help
