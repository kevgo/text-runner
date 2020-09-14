build:

cuke:
	${CURDIR}/node_modules/.bin/cucumber-js --tags "(not @online) and (not @todo)" --format=progress-bar --parallel `node -e 'console.log(os.cpus().length)'` '**/*.feature'
cuke-lerna:
	echo Text-Runner E2E tests ...
	${CURDIR}/node_modules/.bin/cucumber-js --tags "(not @online) and (not @todo)" --format=summary --parallel `node -e 'console.log(os.cpus().length)'` '**/*.feature'
cuke-smoke:  # runs the Windows smoke tests
	${CURDIR}/node_modules/.bin/cucumber-js --tags '@smoke' --format=progress '**/*.feature'


fix:

lint:

test: cuke
test-lerna: cuke-lerna

unit:

.SILENT:
