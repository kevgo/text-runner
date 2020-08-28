cuke-lerna: build  # runs the feature specs
	echo Text-Runner E2E tests ...
	${CURDIR}/node_modules/.bin/cucumber-js --tags "(not @online) and (not @todo)" --format summary --parallel `node -e 'console.log(os.cpus().length)'`

test:  # cuke-lerna is run as part of text-runner
