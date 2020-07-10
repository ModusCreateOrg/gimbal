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
BASE_DIR="$( cd "${DIR}/.." && pwd )"
EXAMPLES_DIR="$BASE_DIR/examples"

export SKIP_PREFLIGHT_CHECK=true

for file in $EXAMPLES_DIR/*; do
  cd $file

  if [[ ! -d node_modules ]]; then
    echo
    echo "# Installing $file example"
    echo

    yarn
  fi

  # if either of these exists, continue
  if [[ -d build ]] || [[ -d dist ]]; then
    continue
  fi

  echo
  echo "# Building $file example"
  echo

  yarn build
done
