#!/usr/bin/env bash
set -euo pipefail

cd "$(dirname "$0")/.."

if ! node scripts/check-node-version.mjs >/dev/null 2>&1; then
  nvm_dir="${NVM_DIR:-$HOME/.nvm}"
  if [ -s "$nvm_dir/nvm.sh" ]; then
    # nvm is usually absent from non-interactive shells.
    # npm sets a prefix that prevents nvm from loading inside npm scripts.
    unset npm_config_prefix NPM_CONFIG_PREFIX
    . "$nvm_dir/nvm.sh"
    nvm use --silent
  fi
fi

node scripts/check-node-version.mjs
exec "$@"
