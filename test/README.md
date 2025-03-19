This folder contains workspaces for end-to-end tests. The current ESM
implementation requires `text-runner` and `typescript` installed into a
`node_modules` folder. Since it takes too much time to `npm install` this for
every end-to-end test, the workspaces in which tests happen are now part of the
multi-workspace setup in this monorepo.
