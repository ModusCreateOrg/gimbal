# Gimbal - Web Performance Budgeting Automation

[![npm (scoped)](https://img.shields.io/npm/v/@modus/gimbal.svg)](https://www.npmjs.com/package/@modus/gimbal)
[![npm](https://img.shields.io/npm/dm/@modus/gimbal.svg)](https://www.npmjs.com/package/@modus/gimbal)
[![CircleCI](https://circleci.com/gh/ModusCreateOrg/gimbal.svg?style=svg&circle-token=070b2e28332dfe71ad3b6b8ab9ee5d472a1d7f76)](https://circleci.com/gh/ModusCreateOrg/gimbal)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square)](http://makeapullrequest.com)
[![MIT Licensed](https://img.shields.io/badge/license-MIT-blue.svg?style=flat-square)](./LICENSE)
[![Powered by Modus_Create](https://img.shields.io/badge/powered_by-Modus_Create-blue.svg?longCache=true&style=flat&logo=data:image/svg+xml;base64,PHN2ZyB2aWV3Qm94PSIwIDAgMzIwIDMwMSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8cGF0aCBkPSJNOTguODI0IDE0OS40OThjMCAxMi41Ny0yLjM1NiAyNC41ODItNi42MzcgMzUuNjM3LTQ5LjEtMjQuODEtODIuNzc1LTc1LjY5Mi04Mi43NzUtMTM0LjQ2IDAtMTcuNzgyIDMuMDkxLTM0LjgzOCA4Ljc0OS01MC42NzVhMTQ5LjUzNSAxNDkuNTM1IDAgMCAxIDQxLjEyNCAxMS4wNDYgMTA3Ljg3NyAxMDcuODc3IDAgMCAwLTcuNTIgMzkuNjI4YzAgMzYuODQyIDE4LjQyMyA2OS4zNiA0Ni41NDQgODguOTAzLjMyNiAzLjI2NS41MTUgNi41Ny41MTUgOS45MjF6TTY3LjgyIDE1LjAxOGM0OS4xIDI0LjgxMSA4Mi43NjggNzUuNzExIDgyLjc2OCAxMzQuNDggMCA4My4xNjgtNjcuNDIgMTUwLjU4OC0xNTAuNTg4IDE1MC41ODh2LTQyLjM1M2M1OS43NzggMCAxMDguMjM1LTQ4LjQ1OSAxMDguMjM1LTEwOC4yMzUgMC0zNi44NS0xOC40My02OS4zOC00Ni41NjItODguOTI3YTk5Ljk0OSA5OS45NDkgMCAwIDEtLjQ5Ny05Ljg5NyA5OC41MTIgOTguNTEyIDAgMCAxIDYuNjQ0LTM1LjY1NnptMTU1LjI5MiAxODIuNzE4YzE3LjczNyAzNS41NTggNTQuNDUgNTkuOTk3IDk2Ljg4OCA1OS45OTd2NDIuMzUzYy02MS45NTUgMC0xMTUuMTYyLTM3LjQyLTEzOC4yOC05MC44ODZhMTU4LjgxMSAxNTguODExIDAgMCAwIDQxLjM5Mi0xMS40NjR6bS0xMC4yNi02My41ODlhOTguMjMyIDk4LjIzMiAwIDAgMS00My40MjggMTQuODg5QzE2OS42NTQgNzIuMjI0IDIyNy4zOSA4Ljk1IDMwMS44NDUuMDAzYzQuNzAxIDEzLjE1MiA3LjU5MyAyNy4xNiA4LjQ1IDQxLjcxNC01MC4xMzMgNC40Ni05MC40MzMgNDMuMDgtOTcuNDQzIDkyLjQzem01NC4yNzgtNjguMTA1YzEyLjc5NC04LjEyNyAyNy41NjctMTMuNDA3IDQzLjQ1Mi0xNC45MTEtLjI0NyA4Mi45NTctNjcuNTY3IDE1MC4xMzItMTUwLjU4MiAxNTAuMTMyLTIuODQ2IDAtNS42NzMtLjA4OC04LjQ4LS4yNDNhMTU5LjM3OCAxNTkuMzc4IDAgMCAwIDguMTk4LTQyLjExOGMuMDk0IDAgLjE4Ny4wMDguMjgyLjAwOCA1NC41NTcgMCA5OS42NjUtNDAuMzczIDEwNy4xMy05Mi44Njh6IiBmaWxsPSIjRkZGIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiLz4KPC9zdmc+)](https://moduscreate.com)


[Installation](#installation-and-usage) |
[Documentation](./packages/gimbal/docs) |
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
yarn global add @modus/gimbal

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

Your project should have been built in order to execute gimbal.

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

### Configuration

You don't need to [Configure Gimbal](./packages/gimbal/docs/config), but we understand that defaults are _optimistic_, at least for existing projects that want to introduce performance budgeting.

To ease you be ready to use, let's start with some **sample `.gimbalrc.yml` config** files:

1. Minimal
2. Minimal with all native audits
3. Using other audit plugins and more sample configurations

Please, make sure your project was build before executing gimbal.

You may save them as your `.gimbalrc.yml` file and run `gimbal`.

#### 1) Minimal sample `.gimbalrc.yml` config file:

```yml
audits:
  - size

configs:
  buildDir: build
```

#### 2) Minimal sample `.gimbalrc.yml` config file running all native audits:

```yml
audits:
  - size
  - lighthouse
  - heap-snapshot
  - unused-source

configs:
  buildDir: build
```

#### 3) Sample `.gimbalrc.yml` config file running audit plugins and more configurations:

Before executing this config file you should install mentioned plugins. For instance:

```sh
# with npm
npm install @modus/gimbal-plugin-axe @modus/gimbal-plugin-last-value @modus/gimbal-plugin-sqlite

# or with yarn
yarn add @modus/gimbal-plugin-axe @modus/gimbal-plugin-last-value @modus/gimbal-plugin-sqlite
```

In case you don't use `build` as your build directory and an exception raises with an error 
concerning a nonexistent `build` directory, please create one and run gimbal again.

Config file:

```yml
# Specify audits to run. Also include any plugins (like axe)
audits:
    - axe
    - size
    - lighthouse
    - heap-snapshot
    - unused-source

configs:
  comment:
    # Only show failures in GitHub PR comments.
    # Useful to pinpoint why a build has failed
    onlyFailures: true

  # Heap snapshot settings
  heap-snapshot:
    threshold:
      Documents: 11
      Frames: 5
      JSHeapTotalSize: 13356000
      JSHeapUsedSize: 10068000
      Nodes: 800
      RecalcStyleCount: 15
      LayoutCount: 15

  # Lighthouse settings
  lighthouse:
    skipAudits:
      - uses-http2
      - redirects-http
      - uses-long-cache-ttl
      - uses-text-compression
    outputHtml: artifacts/lighthouse.html
    threshold:
      accessibility: 90
      "best-practices": 92
      performance: 64
      pwa: 52
      seo: 100

  # File and directory size settings
  size:
    - path: ./build/precache-*.js
      maxSize: 10 KB
    - path: ./build/static/js/[0-9]*.chunk.js
      maxSize: 1 MB
    - path: ./build/static/js/*.chunk.js
      maxSize: 1 MB
    - path: ./build/static/js/runtime*.js
      maxSize: 10 KB
    - path: ./build/index.html
      maxSize: 10 KB
    - path: ./build/favicon.ico
      maxSize: 10 KB
    - path: ./build/
      maxSize: 18 MB

  # Unused source settings
  unused-source:
    threshold:
      - path: "**/*(private).*.chunk.css"
        maxSize: 60%
      - path: "**/!(private).*.chunk.css"
        maxSize: 60%
      - path: "**/*([0-9]).*.chunk.js"
        maxSize: 90%
      - path: "**/!([0-9]|main).*.chunk.js"
        maxSize: 45%
      - path: "**/(main).*.chunk.js"
        maxSize: 50%

# Locations of reports. Useful for storing artifacts in CI
outputs:
  # Only show failures in CLI
  cli:
    onlyFailures: true
  html: artifacts/results.html
  json: artifacts/results.json
  markdown: artifacts/results.md

# Plugins
plugins:
  # Compare metrics to last-saved values
  # Install the Last Value plugin with
  #     npm i @modus/gimbal-plugin-last-value --save-dev 
  - plugin: "@modus/gimbal-plugin-last-value"
    saveOnlyOnSuccess: false

  # Save reports to a database. Needed for gimbal-plugin-last-value
  # Install the Sqlite plugin with
  #     npm i @modus/gimbal-plugin-sqlite --save-dev 
  - plugin: "@modus/gimbal-plugin-sqlite"
    lastValue: true

  # Axe a11y audits
  # Install Axe plugin with
  #     npm i @modus/gimbal-plugin-axe --save-dev 
  - plugin: "@modus/gimbal-plugin-axe"
    thresholds:
      aria-allowed-attr: critical
      color-contrast: serious
      landmark-one-main: moderate
      landmark-complementary-is-top-level: moderate
      meta-viewport: critical
      region: moderate
      page-has-heading-one: moderate
      scrollable-region-focusable: moderate

```

### CI Integration

Consult with our docs for sample CI configuration files:

* [GitHub Actions](https://github.com/ModusCreateOrg/gimbal/tree/master/packages/gimbal/docs/ci/github)
* [Circle CI](https://github.com/ModusCreateOrg/gimbal/tree/master/packages/gimbal/docs/ci/circleci)
* [Travis CI](https://github.com/ModusCreateOrg/gimbal/tree/master/packages/gimbal/docs/ci/travisci)

### Docker
Docker images are available in Docker Hub as [moduscreate/gimbal](https://hub.docker.com/r/moduscreate/gimbal/tags).

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

### Manage UI Performance Budgets with Gimbal
[![Manage UI Performance Budgets with Gimbal](https://img.youtube.com/vi/7nOH3EG4nV4/0.jpg)](https://youtu.be/7nOH3EG4nV4?t=138)

## Modus Create

[Modus Create](https://moduscreate.com) is a digital product consultancy. We use a distributed team of the best talent in the world to offer a full suite of digital product design-build services; ranging from consumer facing apps, to digital migration, to agile development training, and business transformation.

[![Modus Create](https://res.cloudinary.com/modus-labs/image/upload/h_80/v1533109874/modus/logo-long-black.png)](https://moduscreate.com)

This project is part of [Modus Labs](https://labs.moduscreate.com).

[![Modus Labs](https://res.cloudinary.com/modus-labs/image/upload/h_80/v1531492623/labs/logo-black.png)](https://labs.moduscreate.com)

## Licensing

This project is [MIT licensed](./LICENSE).
