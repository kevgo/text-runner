cd ..
dir
cd dist
dir
type cli.js
copy cli.js cli2.js
dir
type cli2.js
node cli2.js
REM @node %~dp0..\dist\cli.js %*
