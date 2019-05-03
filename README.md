```
      ___                       ___                         ___
     /\__\                     /\  \         _____         /\  \
    /:/ _/_       ___         |::\  \       /::\  \       /::\  \
   /:/ /\  \     /\__\        |:|:\  \     /:/\:\  \     /:/\:\  \
  /:/ /::\  \   /:/__/      __|:|\:\  \   /:/ /::\__\   /:/ /::\  \   ___     ___
 /:/__\/\:\__\ /::\  \     /::::|_\:\__\ /:/_/:/\:|__| /:/_/:/\:\__\ /\  \   /\__\
 \:\  \ /:/  / \/\:\  \__  \:\~~\  \/__/ \:\/:/ /:/  / \:\/:/  \/__/ \:\  \ /:/  /
  \:\  /:/  /     \:\/\__\  \:\  \        \::/_/:/  /   \::/__/       \:\  /:/  /
   \:\/:/  /       \::/  /   \:\  \        \:\/:/  /     \:\  \        \:\/:/  /
    \::/  /        /:/  /     \:\__\        \::/  /       \:\__\        \::/  /
     \/__/         \/__/       \/__/         \/__/         \/__/         \/__/

  _                 __  __               _                    ____                         _
 | |__    _   _    |  \/  |   ___     __| |  _   _   ___     / ___|  _ __    ___    __ _  | |_    ___
 | '_ \  | | | |   | |\/| |  / _ \   / _` | | | | | / __|   | |     | '__|  / _ \  / _` | | __|  / _ \
 | |_) | | |_| |   | |  | | | (_) | | (_| | | |_| | \__ \   | |___  | |    |  __/ | (_| | | |_  |  __/
 |_.__/   \__, |   |_|  |_|  \___/   \__,_|  \__,_| |___/    \____| |_|     \___|  \__,_|  \__|  \___|
          |___/
```

[![CircleCI](https://circleci.com/gh/ModusCreateOrg/gimbal.svg?style=svg&circle-token=070b2e28332dfe71ad3b6b8ab9ee5d472a1d7f76)](https://circleci.com/gh/ModusCreateOrg/gimbal)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square)](http://makeapullrequest.com)
[![MIT Licensed](https://img.shields.io/badge/license-MIT-blue.svg?style=flat-square)](./LICENSE)
[![Powered by Modus_Create](https://img.shields.io/badge/powered_by-Modus_Create-blue.svg?longCache=true&style=flat&logo=data:image/svg+xml;base64,PHN2ZyB2aWV3Qm94PSIwIDAgMzIwIDMwMSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8cGF0aCBkPSJNOTguODI0IDE0OS40OThjMCAxMi41Ny0yLjM1NiAyNC41ODItNi42MzcgMzUuNjM3LTQ5LjEtMjQuODEtODIuNzc1LTc1LjY5Mi04Mi43NzUtMTM0LjQ2IDAtMTcuNzgyIDMuMDkxLTM0LjgzOCA4Ljc0OS01MC42NzVhMTQ5LjUzNSAxNDkuNTM1IDAgMCAxIDQxLjEyNCAxMS4wNDYgMTA3Ljg3NyAxMDcuODc3IDAgMCAwLTcuNTIgMzkuNjI4YzAgMzYuODQyIDE4LjQyMyA2OS4zNiA0Ni41NDQgODguOTAzLjMyNiAzLjI2NS41MTUgNi41Ny41MTUgOS45MjF6TTY3LjgyIDE1LjAxOGM0OS4xIDI0LjgxMSA4Mi43NjggNzUuNzExIDgyLjc2OCAxMzQuNDggMCA4My4xNjgtNjcuNDIgMTUwLjU4OC0xNTAuNTg4IDE1MC41ODh2LTQyLjM1M2M1OS43NzggMCAxMDguMjM1LTQ4LjQ1OSAxMDguMjM1LTEwOC4yMzUgMC0zNi44NS0xOC40My02OS4zOC00Ni41NjItODguOTI3YTk5Ljk0OSA5OS45NDkgMCAwIDEtLjQ5Ny05Ljg5NyA5OC41MTIgOTguNTEyIDAgMCAxIDYuNjQ0LTM1LjY1NnptMTU1LjI5MiAxODIuNzE4YzE3LjczNyAzNS41NTggNTQuNDUgNTkuOTk3IDk2Ljg4OCA1OS45OTd2NDIuMzUzYy02MS45NTUgMC0xMTUuMTYyLTM3LjQyLTEzOC4yOC05MC44ODZhMTU4LjgxMSAxNTguODExIDAgMCAwIDQxLjM5Mi0xMS40NjR6bS0xMC4yNi02My41ODlhOTguMjMyIDk4LjIzMiAwIDAgMS00My40MjggMTQuODg5QzE2OS42NTQgNzIuMjI0IDIyNy4zOSA4Ljk1IDMwMS44NDUuMDAzYzQuNzAxIDEzLjE1MiA3LjU5MyAyNy4xNiA4LjQ1IDQxLjcxNC01MC4xMzMgNC40Ni05MC40MzMgNDMuMDgtOTcuNDQzIDkyLjQzem01NC4yNzgtNjguMTA1YzEyLjc5NC04LjEyNyAyNy41NjctMTMuNDA3IDQzLjQ1Mi0xNC45MTEtLjI0NyA4Mi45NTctNjcuNTY3IDE1MC4xMzItMTUwLjU4MiAxNTAuMTMyLTIuODQ2IDAtNS42NzMtLjA4OC04LjQ4LS4yNDNhMTU5LjM3OCAxNTkuMzc4IDAgMCAwIDguMTk4LTQyLjExOGMuMDk0IDAgLjE4Ny4wMDguMjgyLjAwOCA1NC41NTcgMCA5OS42NjUtNDAuMzczIDEwNy4xMy05Mi44Njh6IiBmaWxsPSIjRkZGIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiLz4KPC9zdmc+)](https://moduscreate.com)

# Gimbal - Web Performance Budgeting Automation

[Installation](#installation-and-usage) |
[Documentation](./docs) |
[Contributing](./.github/CONTRIBUTING.md) |
[Code of Conduct](./CODE_OF_CONDUCT.md) |
[Twitter](https://twitter.com/ModusCreate)

Gimbal uses industry-standard audits to analyze application performance. Continuously track performance to ensure your apps are within acceptable budgets. Configure your own thresholds and report the status automatically as a foldable comment in [GitHub](https://github.com/) PRs. Gimbal ❤️ CIs like [Circle CI](https://circleci.com/) and [Travis CI](https://travis-ci.com/).

**Audits:**

- Lighthouse
- File sizes
- Directory sizes
- Heap memory
- CSS and JS coverage

## Installation and Usage

Prerequisites: [Node.js](https://nodejs.org/) (10.0.0+)

You can install Gimbal using npm or yarn in your Node.js project:

```
$ npm install --save-dev gimbal
$ yarn add --dev gimbal
```

You can execute it via a npm script:

```
"gimbal": "gimbal --help"
```

You can also install it globally:

```
$ npm install --global gimbal
$ yarn add global gimbal
```

Now the `gimbal` is executable throughout your system, not just your project.

## Configuration

Gimbal supports configuration files in JavaScript, JSON and YAML formats. This configuration file will let Gimbal know what to execute, you can modify configurations for modules, and output reports in different formats (HTML, JSON, and Markdown). Just place a `.gimbalrc.yml` (or `.gimbalrc.js` or `.gimbalrc.json`) in the root of your project where you will execute Gimbal. An example configuration file would look like:

```yaml
configs:
  puppeteer:
    headless: false

outputs:
  html: ./artifacts/gimbal.html
  json: ./artifacts/gimbal.json
  markdown: ./artifacts/gimbal.md
```

More about configurations can be found on the individual documentation pages of each commands and modules.

## Thresholds

The main purpose of Gimbal is to run audits against an application. Each audit has it's own threshold or set of thresholds. Gimbal also comes configured by default to allow a [create-react-app](https://facebook.github.io/create-react-app/) to pass. If you were to start with a React application created from CRA, you will need to adjust the thresholds as your application will inevitably grow in size. Each module can have it's thresholds configured via the [configuration file](#configuration). For example, the `size` module's thresholds are configured via an array of objects:

```yaml
configs:
  size:
    - path: ./build/precache-*.js
      maxSize: 500 B
    - path: ./build/static/js/*.chunk.js
      maxSize: 1 MB
    - path: ./build/static/js/runtime*.js
      maxSize: 10 KB
    - path: ./build/
      maxSize: 18 MB
```

More about configuring thresholds can be found on the individual documentation pages of each commands and modules.

## Modus Create

[Modus Create](https://moduscreate.com) is a digital product consultancy. We use a distributed team of the best talent in the world to offer a full suite of digital product design-build services; ranging from consumer facing apps, to digital migration, to agile development training, and business transformation.

[![Modus Create](https://res.cloudinary.com/modus-labs/image/upload/h_80/v1533109874/modus/logo-long-black.png)](https://moduscreate.com)

This project is part of [Modus Labs](https://labs.moduscreate.com).

[![Modus Labs](https://res.cloudinary.com/modus-labs/image/upload/h_80/v1531492623/labs/logo-black.png)](https://labs.moduscreate.com)

## Licensing

This project is [MIT licensed](./LICENSE).
