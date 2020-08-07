docs:  # runs the documentation tests
	@echo documentation tests for documentation ...
	@rm -rf tmp
	@# TODO: use "none" formatter, see https://github.com/kevgo/text-runner/issues/932
	@${CURDIR}/../text-runner/bin/text-run static --format progress
	@${CURDIR}/../text-runner/bin/text-run dynamic --format progress
