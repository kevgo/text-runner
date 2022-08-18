This folder contains workspaces for End-to-end tests. The current ESM
implementation requires workspaces to contain a node_modules folder containing
`text-runner`, `ts-node`, and `typescript`. Since it takes too much time to
`yarn install` them for every end-to-end test, the workspaces in which tests
happen are now part of the Yarn workspaces in this monorepo.
