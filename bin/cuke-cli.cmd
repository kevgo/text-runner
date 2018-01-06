call bin\build
set EXOSERVICE_TEST_DEPTH=CLI
call node_modules\.bin\cucumber-js --tags "(not @apionly) and (not @todo) and (not @skipWindows)" --format progress
