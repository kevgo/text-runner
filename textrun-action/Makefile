build:  # builds for the current platform
	@echo building ...
	@${CURDIR}/node_modules/.bin/tsc -p tsconfig.json

docs: build  # runs the documentation tests
	@echo documentation tests ...
	@rm -rf tmp
	@${CURDIR}/node_modules/.bin/text-run --offline --format progress

help:  # prints all make targets
	@cat Makefile | grep '^[^ ]*:' | grep -v '.PHONY' | grep -v help | sed 's/:.*#/#/' | column -s "#" -t

test: docs  # runs all tests
