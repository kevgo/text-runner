# Yarna

> Lerna for Yarn workspaces

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

### Alternatives

[Lerna](https://github.com/lerna/lerna) is a tool for mono-repos of JavaScript
codebases. It integrates well with Yarn workspaces and is a serious alternative
to Yarna. Here are the differences:

- Lerna is much more widespread, used by most large JS mono-repos in the wild
- Yarna is much leaner and more unix-like. Lerna is a big complex system that
  does everything: run Git, manage workspaces, hoist dependencies, execute
  programs, etc. Yarna does one thing: massage lists of workspaces. Running Git,
  managing workspaces and dependencies, executing tasks is done separately by
  other programs.
- Yarna can handle a root workspace in the root folder that contains the other
  workspaces
- Yarna works better if you use Makefiles instead of scripts in package.json
