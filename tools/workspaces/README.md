# Workspaces tool

This tool converts a text stream of filenames into a text stream of workspaces.

### Usage

Compile all code bases with uncommitted changes:

```
git diff --name-only | workspaces | xargs -i{} 'cd {} && make build'
```

Compile all code bases that are changed on a branch:

```
git diff --name-only master | workspaces | xargs -i{} 'cd {} && make build'
```

Test all changed code bases on CI:

```
git diff --name-only origin/master | workspaces | xargs -i{} 'cd {} && make test'
```

skip test if workspace isn't changed on ci:

```
git diff --name-only origin/master | workspaces | grep [workspace this job is for] | xargs -i{} 'cd {} && make test'
```
