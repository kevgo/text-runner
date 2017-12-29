call bin\build
set EXOSERVICE_TEST_DEPTH=API
call node_modules\.bin\cucumber-js --tags '(not @clionly) and (not @todo) and (not @skipWindows)' --format progress
