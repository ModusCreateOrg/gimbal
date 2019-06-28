# Gimbal `source-map-explorer` Plugin

[![npm (scoped)](https://img.shields.io/npm/v/@modus/gimbal-plugin-source-map-explorer.svg)](https://www.npmjs.com/package/@modus/gimbal-plugin-source-map-explorer)
[![npm](https://img.shields.io/npm/dm/@modus/gimbal-plugin-source-map-explorer.svg)](https://www.npmjs.com/package/@modus/gimbal-plugin-source-map-explorer)
[![CircleCI](https://circleci.com/gh/ModusCreateOrg/gimbal.svg?style=svg&circle-token=070b2e28332dfe71ad3b6b8ab9ee5d472a1d7f76)](https://circleci.com/gh/ModusCreateOrg/gimbal)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square)](http://makeapullrequest.com)
[![MIT Licensed](https://img.shields.io/badge/license-MIT-blue.svg?style=flat-square)](./LICENSE)
[![Powered by Modus_Create](https://img.shields.io/badge/powered_by-Modus_Create-blue.svg?longCache=true&style=flat&logo=data:image/svg+xml;base64,PHN2ZyB2aWV3Qm94PSIwIDAgMzIwIDMwMSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8cGF0aCBkPSJNOTguODI0IDE0OS40OThjMCAxMi41Ny0yLjM1NiAyNC41ODItNi42MzcgMzUuNjM3LTQ5LjEtMjQuODEtODIuNzc1LTc1LjY5Mi04Mi43NzUtMTM0LjQ2IDAtMTcuNzgyIDMuMDkxLTM0LjgzOCA4Ljc0OS01MC42NzVhMTQ5LjUzNSAxNDkuNTM1IDAgMCAxIDQxLjEyNCAxMS4wNDYgMTA3Ljg3NyAxMDcuODc3IDAgMCAwLTcuNTIgMzkuNjI4YzAgMzYuODQyIDE4LjQyMyA2OS4zNiA0Ni41NDQgODguOTAzLjMyNiAzLjI2NS41MTUgNi41Ny41MTUgOS45MjF6TTY3LjgyIDE1LjAxOGM0OS4xIDI0LjgxMSA4Mi43NjggNzUuNzExIDgyLjc2OCAxMzQuNDggMCA4My4xNjgtNjcuNDIgMTUwLjU4OC0xNTAuNTg4IDE1MC41ODh2LTQyLjM1M2M1OS43NzggMCAxMDguMjM1LTQ4LjQ1OSAxMDguMjM1LTEwOC4yMzUgMC0zNi44NS0xOC40My02OS4zOC00Ni41NjItODguOTI3YTk5Ljk0OSA5OS45NDkgMCAwIDEtLjQ5Ny05Ljg5NyA5OC41MTIgOTguNTEyIDAgMCAxIDYuNjQ0LTM1LjY1NnptMTU1LjI5MiAxODIuNzE4YzE3LjczNyAzNS41NTggNTQuNDUgNTkuOTk3IDk2Ljg4OCA1OS45OTd2NDIuMzUzYy02MS45NTUgMC0xMTUuMTYyLTM3LjQyLTEzOC4yOC05MC44ODZhMTU4LjgxMSAxNTguODExIDAgMCAwIDQxLjM5Mi0xMS40NjR6bS0xMC4yNi02My41ODlhOTguMjMyIDk4LjIzMiAwIDAgMS00My40MjggMTQuODg5QzE2OS42NTQgNzIuMjI0IDIyNy4zOSA4Ljk1IDMwMS44NDUuMDAzYzQuNzAxIDEzLjE1MiA3LjU5MyAyNy4xNiA4LjQ1IDQxLjcxNC01MC4xMzMgNC40Ni05MC40MzMgNDMuMDgtOTcuNDQzIDkyLjQzem01NC4yNzgtNjguMTA1YzEyLjc5NC04LjEyNyAyNy41NjctMTMuNDA3IDQzLjQ1Mi0xNC45MTEtLjI0NyA4Mi45NTctNjcuNTY3IDE1MC4xMzItMTUwLjU4MiAxNTAuMTMyLTIuODQ2IDAtNS42NzMtLjA4OC04LjQ4LS4yNDNhMTU5LjM3OCAxNTkuMzc4IDAgMCAwIDguMTk4LTQyLjExOGMuMDk0IDAgLjE4Ny4wMDguMjgyLjAwOCA1NC41NTcgMCA5OS42NjUtNDAuMzczIDEwNy4xMy05Mi44Njh6IiBmaWxsPSIjRkZGIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiLz4KPC9zdmc+)](https://moduscreate.com)

A Gimbal plugin to add [Source Map Explorer](https://github.com/danvk/source-map-explorer) auditing.

## Installation

First, you need to install the plugin to your project:

```sh
# with npm
npm install --save-dev @modus/gimbal-plugin-source-map-explorer

# or with yarn
yarn add --dev @modus/gimbal-plugin-source-map-explorer
```

Next, you need to add the plugin to your Gimbal configuration file:

### YAML

```yaml
plugins:
  - '@modus/gimbal-plugin-source-map-explorer'
```

### JSON

```json
{
  "plugins": ["@modus/gimbal-plugin-source-map-explorer"]
}
```

### JavaScript

```javascript
modules.exports = {
  plugins: ['@modus/gimbal-plugin-source-map-explorer'],
};
```

## Configuration

By default, it will not check the sizes of the bundled files. You can check for file sizes within bundles using the `bundles` config using glob syntax for the bundle file name and the files within the bundle:

```yaml
plugins:
  - plugin: '@modus/gimbal-plugin-source-map-explorer'
    bundles:
      - path: '**/main.*.js'
        thresholds:
          App.js: 450 B
          index.js: 100 B
          logo.svg: 250 B
          serviceWorker.js: 300 B
          <unmapped>: 150 B
      - path: '**/2.*.js'
        thresholds:
          react/index.js: 50 B
          object-assign/index.js: 1 KB
          react-dom/index.js: 300 B
          react/cjs/react.production.min.js: 7 KB
          react-dom/cjs/react-dom.production.min.js: 110 KB
          scheduler/index.js: 50 B
          scheduler/cjs/scheduler.production.min.js: 5 KB
          webpack/**/*.js: 150 B
          <unmapped>: 150 B
      - '!precache-manifest*'
      - '!service-worker.js'
      - '!**/runtime*.js'
```
