cd ..
dir
cd dist
dir
copy cli.js cli2.js
node cli2.js
REM @node %~dp0..\dist\cli.js %*
