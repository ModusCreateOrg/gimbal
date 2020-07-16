#!/usr/bin/env bash

# Set bash unofficial strict mode http://redsymbol.net/articles/unofficial-bash-strict-mode/
set -euo pipefail
IFS=$'\n\t'

# Set DEBUG to true for enhanced debugging: run prefixed with "DEBUG=true"
${DEBUG:-false} && set -vx
# Credit to https://stackoverflow.com/a/17805088
# and http://wiki.bash-hackers.org/scripting/debuggingtips
export PS4='+(${BASH_SOURCE}:${LINENO}): ${FUNCNAME[0]:+${FUNCNAME[0]}(): }'

# Credit to http://stackoverflow.com/a/246128/424301
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
BASE_DIR=$( cd "${DIR}/.." && pwd )
GIMBAL_DIR="$BASE_DIR/packages/gimbal"
EXAMPLE=${1:-}
CONFIG_FILE=${2:-.gimbalrc.yml}

if [[ ! "$EXAMPLE" ]]; then
  echo "Must provide an example, e.g.: ./test_example.sh react"

  exit 1
fi

EXAMPLE_DIR="$BASE_DIR/examples/$EXAMPLE"

if [[ ! -d "$EXAMPLE_DIR" ]]; then
  echo "Example was not found at:"
  echo "  $EXAMPLE_DIR"

  exit 1
fi

export SKIP_PREFLIGHT_CHECK=true

cd "$EXAMPLE_DIR"

echo

if [[ -d node_modules ]]; then
  echo "# Skipping dependency installation"
else
  echo "# Installing $EXAMPLE example dependencies..."

  npm ci
fi

echo

if [[ -d build ]] || [[ -d dist ]]; then
  echo "# Skipping building"
else
  echo "# Building $EXAMPLE example..."

  npm run build
fi

cd "$GIMBAL_DIR"

echo
echo "# Testing $EXAMPLE example..."
echo

npm start -- --verbose --cwd "$EXAMPLE_DIR" --config "$CONFIG_FILE"
# npm run start:break -- --verbose --cwd "$EXAMPLE_DIR" --config "$CONFIG_FILE"
