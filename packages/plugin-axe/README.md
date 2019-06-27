# Gimbal `axe` Plugin

[![npm (scoped)](https://img.shields.io/npm/v/@modus/gimbal-plugin-axe.svg)](https://www.npmjs.com/package/@modus/gimbal-plugin-axe)
[![npm](https://img.shields.io/npm/dm/@modus/gimbal-plugin-axe.svg)](https://www.npmjs.com/package/@modus/gimbal-plugin-axe)
[![CircleCI](https://circleci.com/gh/ModusCreateOrg/gimbal.svg?style=svg&circle-token=070b2e28332dfe71ad3b6b8ab9ee5d472a1d7f76)](https://circleci.com/gh/ModusCreateOrg/gimbal)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square)](http://makeapullrequest.com)
[![MIT Licensed](https://img.shields.io/badge/license-MIT-blue.svg?style=flat-square)](./LICENSE)
[![Powered by Modus_Create](https://img.shields.io/badge/powered_by-Modus_Create-blue.svg?longCache=true&style=flat&logo=data:image/svg+xml;base64,PHN2ZyB2aWV3Qm94PSIwIDAgMzIwIDMwMSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8cGF0aCBkPSJNOTguODI0IDE0OS40OThjMCAxMi41Ny0yLjM1NiAyNC41ODItNi42MzcgMzUuNjM3LTQ5LjEtMjQuODEtODIuNzc1LTc1LjY5Mi04Mi43NzUtMTM0LjQ2IDAtMTcuNzgyIDMuMDkxLTM0LjgzOCA4Ljc0OS01MC42NzVhMTQ5LjUzNSAxNDkuNTM1IDAgMCAxIDQxLjEyNCAxMS4wNDYgMTA3Ljg3NyAxMDcuODc3IDAgMCAwLTcuNTIgMzkuNjI4YzAgMzYuODQyIDE4LjQyMyA2OS4zNiA0Ni41NDQgODguOTAzLjMyNiAzLjI2NS41MTUgNi41Ny41MTUgOS45MjF6TTY3LjgyIDE1LjAxOGM0OS4xIDI0LjgxMSA4Mi43NjggNzUuNzExIDgyLjc2OCAxMzQuNDggMCA4My4xNjgtNjcuNDIgMTUwLjU4OC0xNTAuNTg4IDE1MC41ODh2LTQyLjM1M2M1OS43NzggMCAxMDguMjM1LTQ4LjQ1OSAxMDguMjM1LTEwOC4yMzUgMC0zNi44NS0xOC40My02OS4zOC00Ni41NjItODguOTI3YTk5Ljk0OSA5OS45NDkgMCAwIDEtLjQ5Ny05Ljg5NyA5OC41MTIgOTguNTEyIDAgMCAxIDYuNjQ0LTM1LjY1NnptMTU1LjI5MiAxODIuNzE4YzE3LjczNyAzNS41NTggNTQuNDUgNTkuOTk3IDk2Ljg4OCA1OS45OTd2NDIuMzUzYy02MS45NTUgMC0xMTUuMTYyLTM3LjQyLTEzOC4yOC05MC44ODZhMTU4LjgxMSAxNTguODExIDAgMCAwIDQxLjM5Mi0xMS40NjR6bS0xMC4yNi02My41ODlhOTguMjMyIDk4LjIzMiAwIDAgMS00My40MjggMTQuODg5QzE2OS42NTQgNzIuMjI0IDIyNy4zOSA4Ljk1IDMwMS44NDUuMDAzYzQuNzAxIDEzLjE1MiA3LjU5MyAyNy4xNiA4LjQ1IDQxLjcxNC01MC4xMzMgNC40Ni05MC40MzMgNDMuMDgtOTcuNDQzIDkyLjQzem01NC4yNzgtNjguMTA1YzEyLjc5NC04LjEyNyAyNy41NjctMTMuNDA3IDQzLjQ1Mi0xNC45MTEtLjI0NyA4Mi45NTctNjcuNTY3IDE1MC4xMzItMTUwLjU4MiAxNTAuMTMyLTIuODQ2IDAtNS42NzMtLjA4OC04LjQ4LS4yNDNhMTU5LjM3OCAxNTkuMzc4IDAgMCAwIDguMTk4LTQyLjExOGMuMDk0IDAgLjE4Ny4wMDguMjgyLjAwOCA1NC41NTcgMCA5OS42NjUtNDAuMzczIDEwNy4xMy05Mi44Njh6IiBmaWxsPSIjRkZGIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiLz4KPC9zdmc+)](https://moduscreate.com)

The `axe` plugin adds axe auditing to [Gimbal](https://labs.modus.app/gimbal-web-performance-audit-budgeting). This plugin will check for violations reported by axe and check the impact of the violations against the configured thresholds.

## Installation

First, you need to install the plugin to your project:

```sh
# with npm
npm install --save-dev @modus/gimbal-plugin-axe

# or with yarn
yarn add --dev @modus/gimbal-plugin-axe
```

Next, you need to add the plugin to your Gimbal configuration file:

### YAML

```yaml
plugins:
  - '@modus/gimbal-plugin-axe'
```

### JSON

```json
{
  "plugins": ["@modus/gimbal-plugin-axe"]
}
```

### JavaScript

```javascript
modules.exports = {
  plugins: ['@modus/gimbal-plugin-axe'],
};
```

## Configuration

There are three configs that you can change:

- `disabledRules` - An optional string or array of strings that will disable certain rules. For more, see [here](https://www.npmjs.com/package/axe-puppeteer#axepuppeteerdisablerulesrules-string--string).
- `exclude` - An optional string or array of strings that will allow certain CSS selectors to be excluded from the axe analysis. For more, see [here](https://www.npmjs.com/package/axe-puppeteer#axepuppeteerexcludeselector-string--string).
- `include` - An optional string or array of strings that will only allow certain CSS selectors to be included in the axe analysis. For more, see [here](https://www.npmjs.com/package/axe-puppeteer#axepuppeteerincludeselector-string--string).
- `rules` - An optional string or array of strings that will only allow certain axe rules to be run in the axe analysis. For more, see [here](https://www.npmjs.com/package/axe-puppeteer#axepuppeteerwithrulesrules-string--string).
- `showSuccesses` - If set to `false`, the output of the final report will now show the successful rules.
- `tags` - An optional string or array of strings that will allow only the specified rule IDs in the axe analysis. For more, see [here](https://www.npmjs.com/package/axe-puppeteer#axepuppeteerwithtagstags-string--string).
- `threshold` - This is the object of thresholds. Each rule can have it's own threshold.

### Threshold

By default, there is a single threshold that is set to `minor` meaning only minor violations will be allowed. Each rule can have it's own threshold defined:

```yaml
plugins:
  - plugin: '@modus/gimbal-plugin-axe'
    thresholds:
      bypass: serious
```

The acceptable levels in order from least to greater impact are: none, minor, moderate, serious, critical.

### Default Configuration

```yaml
plugins:
  - plugin: '@modus/gimbal-plugin-axe'
    showSuccesses: true
    thresholds:
      impact: none
```
