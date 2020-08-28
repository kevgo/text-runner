build:

cuke:
	${CURDIR}/node_modules/.bin/cucumber-js --tags "(not @online) and (not @todo)" --format progress-bar --parallel `node -e 'console.log(os.cpus().length)'` '**/*.feature'
cuke-lerna:  # runs the feature specs
	echo Text-Runner E2E tests ...
	${CURDIR}/node_modules/.bin/cucumber-js --tags "(not @online) and (not @todo)" --format summary --parallel `node -e 'console.log(os.cpus().length)'` '**/*.feature'

fix:

lint:

test:
test-lerna:

unit:

.SILENT:
