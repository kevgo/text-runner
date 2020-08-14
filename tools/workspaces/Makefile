build:  # builds for the current platform
	@echo workspaces tool build ...
	@${CURDIR}/node_modules/.bin/tsc -p tsconfig.json

clean:  # Removes all build artifacts
	@echo workspaces tool artifact cleanup ...
	@rm -rf dist

cuke:
	@echo workspaces tool E2E tests ...

docs: build  # runs the documentation tests
	@echo workspaces tool documentation tests ...
	# @rm -rf tmp
	# @${CURDIR}/node_modules/.bin/text-run static --offline --format progress
	# @${CURDIR}/node_modules/.bin/text-run dynamic --format progress

fix:  # runs the auto-fixers
	@echo workspaces tool auto-fixes ...
	@${CURDIR}/node_modules/.bin/tslint --project tsconfig.json --fix
	@${CURDIR}/node_modules/.bin/prettier --write .

help:  # prints all make targets
	@cat Makefile | grep '^[^ ]*:' | grep -v '.PHONY' | grep -v help | sed 's/:.*#/#/' | column -s "#" -t

lint:  # lints all files in this codebase
	@echo workspaces tool linters ...
	@${CURDIR}/node_modules/.bin/prettier -l .
	@${CURDIR}/node_modules/.bin/tslint --project tsconfig.json --config ../../tslint.json

test: lint unit docs  # runs all tests

test-ts: unit  # runs all code tests

unit:  # runs the unit tests
	@echo workspaces tool unit tests ...
	@${CURDIR}/node_modules/.bin/mocha --reporter dot "src/**/*.test.ts"
