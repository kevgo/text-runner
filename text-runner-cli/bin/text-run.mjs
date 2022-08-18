#!/usr/bin/env sh

if [ -L "$0" ]; then
  # the binary is a symlink
  SYMLINK_TARGET=$(readlink -f "$0")
  BIN_DIR=$(dirname -- "$SYMLINK_TARGET")
  CLI_DIR=$(dirname -- "$BIN_DIR")
else
  echo "The binary is not a symlink."
  echo "Please file a bug report with your setup at https://github.com/kevgo/text-runner/issues."
  exit 1
fi

node --experimental-loader ts-node/esm --no-warnings "$CLI_DIR/dist/index.js" "$@"
