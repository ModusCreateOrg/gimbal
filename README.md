# Gimbal - Web Performance Budgeting Automation

[![npm (scoped)](https://img.shields.io/npm/v/@modus/gimbal.svg)](https://www.npmjs.com/package/@modus/gimbal)
[![npm](https://img.shields.io/npm/dm/@modus/gimbal.svg)](https://www.npmjs.com/package/@modus/gimbal)
[![CircleCI](https://circleci.com/gh/ModusCreateOrg/gimbal.svg?style=svg&circle-token=070b2e28332dfe71ad3b6b8ab9ee5d472a1d7f76)](https://circleci.com/gh/ModusCreateOrg/gimbal)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square)](http://makeapullrequest.com)
[![MIT Licensed](https://img.shields.io/badge/license-MIT-blue.svg?style=flat-square)](./LICENSE)
[![Powered by Modus_Create](https://img.shields.io/badge/powered_by-Modus_Create-blue.svg?longCache=true&style=flat&logo=data:image/svg+xml;base64,PHN2ZyB2aWV3Qm94PSIwIDAgMzIwIDMwMSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8cGF0aCBkPSJNOTguODI0IDE0OS40OThjMCAxMi41Ny0yLjM1NiAyNC41ODItNi42MzcgMzUuNjM3LTQ5LjEtMjQuODEtODIuNzc1LTc1LjY5Mi04Mi43NzUtMTM0LjQ2IDAtMTcuNzgyIDMuMDkxLTM0LjgzOCA4Ljc0OS01MC42NzVhMTQ5LjUzNSAxNDkuNTM1IDAgMCAxIDQxLjEyNCAxMS4wNDYgMTA3Ljg3NyAxMDcuODc3IDAgMCAwLTcuNTIgMzkuNjI4YzAgMzYuODQyIDE4LjQyMyA2OS4zNiA0Ni41NDQgODguOTAzLjMyNiAzLjI2NS41MTUgNi41Ny41MTUgOS45MjF6TTY3LjgyIDE1LjAxOGM0OS4xIDI0LjgxMSA4Mi43NjggNzUuNzExIDgyLjc2OCAxMzQuNDggMCA4My4xNjgtNjcuNDIgMTUwLjU4OC0xNTAuNTg4IDE1MC41ODh2LTQyLjM1M2M1OS43NzggMCAxMDguMjM1LTQ4LjQ1OSAxMDguMjM1LTEwOC4yMzUgMC0zNi44NS0xOC40My02OS4zOC00Ni41NjItODguOTI3YTk5Ljk0OSA5OS45NDkgMCAwIDEtLjQ5Ny05Ljg5NyA5OC41MTIgOTguNTEyIDAgMCAxIDYuNjQ0LTM1LjY1NnptMTU1LjI5MiAxODIuNzE4YzE3LjczNyAzNS41NTggNTQuNDUgNTkuOTk3IDk2Ljg4OCA1OS45OTd2NDIuMzUzYy02MS45NTUgMC0xMTUuMTYyLTM3LjQyLTEzOC4yOC05MC44ODZhMTU4LjgxMSAxNTguODExIDAgMCAwIDQxLjM5Mi0xMS40NjR6bS0xMC4yNi02My41ODlhOTguMjMyIDk4LjIzMiAwIDAgMS00My40MjggMTQuODg5QzE2OS42NTQgNzIuMjI0IDIyNy4zOSA4Ljk1IDMwMS44NDUuMDAzYzQuNzAxIDEzLjE1MiA3LjU5MyAyNy4xNiA4LjQ1IDQxLjcxNC01MC4xMzMgNC40Ni05MC40MzMgNDMuMDgtOTcuNDQzIDkyLjQzem01NC4yNzgtNjguMTA1YzEyLjc5NC04LjEyNyAyNy41NjctMTMuNDA3IDQzLjQ1Mi0xNC45MTEtLjI0NyA4Mi45NTctNjcuNTY3IDE1MC4xMzItMTUwLjU4MiAxNTAuMTMyLTIuODQ2IDAtNS42NzMtLjA4OC04LjQ4LS4yNDNhMTU5LjM3OCAxNTkuMzc4IDAgMCAwIDguMTk4LTQyLjExOGMuMDk0IDAgLjE4Ny4wMDguMjgyLjAwOCA1NC41NTcgMCA5OS42NjUtNDAuMzczIDEwNy4xMy05Mi44Njh6IiBmaWxsPSIjRkZGIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiLz4KPC9zdmc+)](https://moduscreate.com)


[Installation](#installation-and-usage) |
[Documentation](./docs) |
[Contributing](./.github/CONTRIBUTING.md) |
[Code of Conduct](./CODE_OF_CONDUCT.md) |
[Twitter](https://twitter.com/ModusCreate)

<img align="left" width="75" height="75" src="https://res.cloudinary.com/modus-labs/image/upload/c_scale,dpr_auto,e_trim:10,f_auto,w_150/v1559132943/labs/gimbal.png">
Gimbal uses industry-standard audits to analyze application performance. Continuously track performance to ensure your apps are within acceptable 🏎performance budgets.

Gimbal ❤️ CIs like [Circle CI](https://github.com/ModusCreateOrg/gimbal/tree/master/packages/gimbal/docs/ci/circleci),  [Travis CI](https://github.com/ModusCreateOrg/gimbal/tree/master/packages/gimbal/docs/ci/travisci), Jenkins, and [GitHub Actions](https://github.com/ModusCreateOrg/gimbal/tree/master/packages/gimbal/docs/ci/github).

## Getting Started

You can install Gimbal globally using `npm` or `yarn`:

```sh
# with npm
npm install --global @modus/gimbal

# or with yarn
yarn add global @modus/gimbal

gimbal --help
```

Now the `gimbal` is executable throughout your system for any projects you want to audit.

You can also install it to a specific project as a development dependency.

```sh
# with npm
npm install --save-dev @modus/gimbal

# or with yarn
yarn add --dev @modus/gimbal
```

You can execute it via a npm script: (`package.json`):

```json
{
  "scripts": {
    "audit": "gimbal audit"
  }
}
```

```sh
# with npm
npm run audit

# or with yarn
yarn audit
```

## Packages

This repo is organized as a [monorepo](https://en.wikipedia.org/wiki/Monorepo) that uses [Lerna](https://lerna.js.org/). Packages:

- [Gimbal](./packages/gimbal)
- [Gimbal Core](./packages/gimbal-core)
- [Axe Plugin](./packages/plugin-axe)
- [Last Value Plugin](./packages/plugin-last-value)
- [MySQL Plugin](./packages/plugin-mysql)
- [SQLite Plugin](./packages/plugin-sqlite)

## Questions and Support

If you have a problem running Gimbal, [please submit an issue](./issues). The more information you give us the faster we can get back with a good answer.

## Modus Create

[Modus Create](https://moduscreate.com) is a digital product consultancy. We use a distributed team of the best talent in the world to offer a full suite of digital product design-build services; ranging from consumer facing apps, to digital migration, to agile development training, and business transformation.

[![Modus Create](https://res.cloudinary.com/modus-labs/image/upload/h_80/v1533109874/modus/logo-long-black.png)](https://moduscreate.com)

This project is part of [Modus Labs](https://labs.moduscreate.com).

[![Modus Labs](https://res.cloudinary.com/modus-labs/image/upload/h_80/v1531492623/labs/logo-black.png)](https://labs.moduscreate.com)

## Licensing

This project is [MIT licensed](./LICENSE).
