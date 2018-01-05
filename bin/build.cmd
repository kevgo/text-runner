IF NOT EXIST dist GOTO NODIR
rmdir dist /s /q
:NODIR
node_modules\.bin\babel src -d dist -q
