# Change Log

## Unreleased

#### Internal

- plugins architecture
- extract non-core actions into plugins
- organize code into a mono-repository

#### New Features

- TypeScript actions ([#907](https://github.com/kevgo/text-runner/pull/907))

#### Breaking changes

- rename "add" command to "scaffold"
  ([#900](https://github.com/kevgo/text-runner/pull/900))

## 4.0.3

_July 9 2020_

#### New Features

- improve error messages ([#889](https://github.com/kevgo/text-runner/pull/889),
  [#890](https://github.com/kevgo/text-runner/pull/890))

## 4.0.2

_Mar 03 2020_

#### Internal

- test files changed to `*.test.js`
  ([875](https://github.com/kevgo/text-runner/pull/875))
- code statistics
  ([1242052](https://github.com/kevgo/text-runner/commit/12420526c81437407fbc57415ec5195092bc7a07)

## 4.0.1

_Feb 15 2020_

#### Internal

- change unit tests to TDD style
  ([#833](https://github.com/kevgo/text-runner/pull/833/files),
  [#850](https://github.com/kevgo/text-runner/pull/850),
  [#851](https://github.com/kevgo/text-runner/pull/851))

## 4.0.0

_Sep 23 2019_

#### New Features

- support for HTML as input
  ([#799](https://github.com/kevgo/text-runner/pull/799))
- progress formatter ([#776](https://github.com/kevgo/text-runner/pull/776))
- support hardbreak tag ([#828](https://github.com/kevgo/text-runner/pull/828))
- handle indented code blocks
  ([#845](https://github.com/kevgo/text-runner/pull/845/files)
- handle embedded code blocks
  ([#836](https://github.com/kevgo/text-runner/pull/836))
- make linebreaks a standalone tag
  ([#834](https://github.com/kevgo/text-runner/pull/834))
- many performance optimizations

#### Breaking Changes

- require Node 10 or higher
- new Markdown parser engine
  ([#807](https://github.com/kevgo/text-runner/pull/807))
- CLI and config file use the same keys
  ([#752](https://github.com/kevgo/text-runner/pull/752))
- remove obsolete internal parameter
  ([#847](https://github.com/kevgo/text-runner/pull/847))
- provide node attributes only for opening AST nodes
  ([#841](https://github.com/kevgo/text-runner/pull/841))

#### Bug Fixes

- prevent infinite loop for links to higher-up directories
  ([acb6d0a](https://github.com/kevgo/text-runner/commit/acb6d0a02552b8e791061451e53a96f7770f22a7)
- handle closing anchor tag correctly
  ([#829](https://github.com/kevgo/text-runner/pull/829/files))

#### Internal

- debugging in VSCode ([#842](https://github.com/kevgo/text-runner/pull/842),
  [08bf920](https://github.com/kevgo/text-runner/commit/08bf920d3ab16ac955622d4c0127a885181ea949)
- new formatter architecture without subclasses
  ([#763](https://github.com/kevgo/text-runner/pull/763))
- format documentation using proseWrap option
  ([#794](https://github.com/kevgo/text-runner/pull/794))
- vastly overhauled internal architecture

## 3.6.0

_Nov 16 2018_

#### New Features

- DIV tag support
  ([4066b26](https://github.com/kevgo/text-runner/commit/4066b26c9cd1d5060dff3aad141ce6031d7ce5f6))
- show code snippet for all Markdown errors
  ([d6f5dd9](https://github.com/kevgo/text-runner/commit/d6f5dd9c74bf315bebaf7b86a3b0acbb7a133fef))

#### Bug Fixes

- show correct error for missing opening tags
  ([4cf3571](https://github.com/kevgo/text-runner/commit/4cf35712e66f38157bc76db6d5985d03fb6fcd04))
- verify all Make commands
  ([5a25648](https://github.com/kevgo/text-runner/commit/5a25648155ecddd515e94e0492e23cbdd60a2c81))

#### Internal

- switch to TypeScript
  ([621e290](https://github.com/kevgo/text-runner/commits/master?after=621e29099e73fa7bbc818088e003b5d3ade5b916+34))
- Windows compatible Makefile
  ([d24d089](https://github.com/kevgo/text-runner/commit/d24d0898f72b58279e424e1ba2e418cd7b64cf79))

## 3.5.0

_Aug 30 2018_

#### New Features

- `--config` CLI switch to specify a custom configuration file
  ([86595d3](https://github.com/kevgo/text-runner/commit/86595d36f93ad9383ff65ff4daa3faf58be8de1d))
- support for `<details>` and `<summary>` tags
  ([a3c692b](https://github.com/kevgo/text-runner/commit/a3c692b5839bda17a543992a7eb322ef94b02c64))
- support relative links in published folders
  ([7654e8a](https://github.com/kevgo/text-runner/commit/7654e8aa5715d617092ec122a260048d869154c5))

## 3.4.0

_Aug 1 2018_

#### New Features

- `defaultFiles` configuration option
  ([738f24e](https://github.com/kevgo/text-runner/commit/738f24ef9709780b0bf52cbefa04dfb6c6077f36))
- improve errors
  ([c8f8856](https://github.com/kevgo/text-runner/commit/c8f8856e2b75caf0e3709bc2425519d0df2b6408))
- support hardbreaks in Markdown
  ([c2594c2](https://github.com/kevgo/text-runner/commit/c2594c278a68d1b84867d468e12101b937927c91))
- show tag errors with code block
  ([7db4836](https://github.com/kevgo/text-runner/commit/7db4836be28e81da331d1d515197000402a92eab))

## 3.0.0

#### Internal

- functional architecture
