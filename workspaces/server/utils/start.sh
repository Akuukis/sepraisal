#!/usr/bin/env bash
set -euo pipefail

MY_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd -P)"
SERVER_DIR="$(cd "$MY_DIR/.." && pwd -P)"

cd "$SERVER_DIR"

if command -v yarn >/dev/null 2>&1; then
    exec yarn start
fi

if command -v corepack >/dev/null 2>&1; then
    exec corepack yarn start
fi

echo "Could not find \`yarn\` or \`corepack\` in PATH=$PATH" >&2
exit 127
