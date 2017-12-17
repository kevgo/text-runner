call node_modules\o-tools-livescript\bin\build
set EXOSERVICE_TEST_DEPTH=CLI
call node_modules\.bin\cucumber-js --tags ~@apionly --tags ~@todo --tags ~@skipWindows --format progress
