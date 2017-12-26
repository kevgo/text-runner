call bin/build
call node_modules/.bin/mocha --reporter dot "test/**/*.js"
