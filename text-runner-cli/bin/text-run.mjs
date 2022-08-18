#!/usr/bin/env sh

if [ -L "$0" ]; then
  # the binary is a symlink
  SYMLINK_TARGET=$(readlink -f "$0")
  BIN_DIR=$(dirname -- "$SYMLINK_TARGET")
  CLI_DIR=$(dirname -- "$BIN_DIR")
else
  # the binary is not a symlink, i.e. we are in the node_modules folder
  CLI_DIR=node_modules/text-runner
fi

node --experimental-loader ts-node/esm --no-warnings "$CLI_DIR/dist/index.js" "$@"
