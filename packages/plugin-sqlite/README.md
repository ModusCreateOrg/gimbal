# Gimbal `sqlite` Plugin

A Gimbal plugin to allow storage of data in a SQLite database.

## Installation

First, you need to install the plugin to your project:

```sh
# with npm
npm install --save-dev @modus/gimbal-plugin-sqlite

# or with yarn
yarn add --dev @modus/gimbal-plugin-sqlite
```

Next, you need to add the plugin to your Gimbal configuration file:

### YAML

```yaml
plugins:
  - '@modus/gimbal-plugin-sqlite'
```

### JSON

```json
{
  "plugins": ["@modus/gimbal-plugin-sqlite"]
}
```

### JavaScript

```javascript
modules.exports = {
  plugins: ['@modus/gimbal-plugin-sqlite'],
};
```

## Configuration

By default, this plugin will save the database to `./gimbal.db`. In order to change this, pass it as a plugin config:

```yaml
plugins:
  - plugin: '@modus/gimbal-plugin-sqlite'
    file: artifacts/gimbal_tests.db
```

### `@modus/gimbal-plugin-last-value`

Allows for getting and saving last value reports. To enable this support, you need to set `lastValue` on the plugin config:

```yaml
plugins:
  - plugin: '@modus/gimbal-plugin-sqlite'
    lastValue: true
```

By default, this will use `gimbal_archive` as the table. To change these values, pass an object to the `lastValue` config:

```yaml
plugins:
  - plugin: '@modus/gimbal-plugin-sqlite'
    lastValue:
      table: test_runs
```

If the table does not exist, the follow SQL will be executed:

```sql
CREATE TABLE IF NOT EXISTS <table_name> (command TEXT, date INTEGER, report BLOB);
```
