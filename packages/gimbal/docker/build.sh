#!/usr/bin/env bash
# Prepare a clean environment

# Set bash unofficial strict mode http://redsymbol.net/articles/unofficial-bash-strict-mode/
set -euo pipefail

# Enable for enhanced debugging
#set -vx
# Credit to https://stackoverflow.com/a/17805088
# and http://wiki.bash-hackers.org/scripting/debuggingtips
export PS4='+(${BASH_SOURCE}:${LINENO}): ${FUNCNAME[0]:+${FUNCNAME[0]}(): }'

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
BASE="$DIR/.."

cd "$BASE" || exit 1

VERSION=`grep -o "\"version\": \".*\"," $BASE/package.json | grep -o "\d*\.\d*\.\d*"`

docker build \
	-t "gimbal:$VERSION" \
	-t "moduscreate/gimbal:$VERSION" \
  --build-arg GIMBAL_VERSION="$VERSION" \
	.
