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

RAW_APP="${1:-./sample}"
APP_DIR="$( cd "$BASE/$RAW_APP" && pwd )"

VERSION=`grep -o "\"version\": \".*\"," $BASE/package.json | grep -o "\d*\.\d*\.\d*"`

docker run -v "$APP_DIR":/app -w /app -it "gimbal:$VERSION" gimbal
