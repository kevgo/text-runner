# Workspaces tool

This tool filters a Unix stream of filenames into a list of valid workspaces

### Usage

To compile all changed code bases:

git diff --name-only | workspaces | xargs -i{} 'cd {} && make build' git diff
--name-only | workspaces run make build

TEST ALL CHANGED CODE BASES ON CI git diff --name-only origin/master |
workspaces | xargs -i{} `cd {} && make test' git diff --name-only origin/master
| workspaces run make test

SKIP TEST IF WORKSPACE ISN'T CHANGED ON CI git diff --name-only origin/master |
workspaces | grep textrun-javascript | xargs -i{} make test git diff --name-only
origin/master | workspaces if "npm-make" make test
