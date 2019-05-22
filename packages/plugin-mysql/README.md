# Gimbal `mysql` Plugin

A Gimbal plugin to allow storage of data in MySQL.

## Installation

First, you need to install the plugin to your project:

```sh
# with npm
npm install --save-dev @modus/gimbal-plugin-mysql

# or with yarn
yarn add --dev @modus/gimbal-plugin-mysql
```

Next, you need to add the plugin to your Gimbal configuration file:

### YAML

```yaml
plugins:
  - @modus/gimbal-plugin-mysql
```

### JSON

```json
{
  "plugins": ["@modus/gimbal-plugin-mysql"]
}
```

### JavaScript

```javascript
modules.exports = {
  plugins: ['@modus/gimbal-plugin-mysql'],
};
```

## Configuration

In order to connect to a MySQL server, you must provide the host, password, and username via environment variables:

- `GIMBAL_MYSQL_HOST` - Defaults to `localhost`, must be the host location of the server.
- `GIMBAL_MYSQL_USERNAME` - Defaults to `root`, must be the username to connect to the server with.
- `GIMBAL_MYSQL_PASSWORD` - Must be the password of the user in order to connect to the server.

### `@modus/gimbal-plugin-last-value`

Allows for getting and saving last value reports. To enable this support, you need to set `lastValue` on the plugin config:

```yaml
plugins:
  - plugin: @modus/gimbal-plugin-mysql
    lastValue: true
```

By default, this will use `gimbal` as the database and `gimbal_archive` table. To change these values, pass an object to the `lastValue` config:

```yaml
plugins:
  - plugin: @modus/gimbal-plugin-mysql
    lastValue:
      database: my-database
      table: test_runs
```

The database must exist. If the table does not exist, the follow SQL will be executed:

```sql
CREATE TABLE IF NOT EXISTS <table_name> (command VARCHAR(255) NOT NULL, date DATETIME NOT NULL, report LONGTEXT NOT NULL) ENGINE=INNODB;
```
