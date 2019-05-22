# Gimbal `last-value` Plugin

The `last-value` plugin adds past value retrieval and saving to Gimbal audits. This plugin adds a new column to the output to show the last value and whether the current value has changed over a threshold.

## Installation

First, you need to install the plugin to your project:

```sh
# with npm
npm install --save-dev @modus/gimbal-plugin-last-value

# or with yarn
yarn add --dev @modus/gimbal-plugin-last-value
```

Next, you need to add the plugin to your Gimbal configuration file:

### YAML

```yaml
plugins:
  - @modus/gimbal-plugin-last-value
```

### JSON

```json
{
  "plugins": ["@modus/gimbal-plugin-last-value"]
}
```

### JavaScript

```javascript
modules.exports = {
  plugins: ['@modus/gimbal-plugin-last-value'],
};
```

## Configuration

There are three configs that you can change:

- `failOnBreach` - Defaults to `false` to allow the plugin to warn of a size change instead of failing on the change. Set to `true` to fail the Gimbal audit run when the current value breaches the threshold of the last value.
- `saveOnlyOnSuccess` - Defaults to `true` to only save the current value to the storage (e.g. MySQL) on a successful Gimbal audit run. Set to `false` to always save the current value to the storage.
- `threshold` - This is the object of thresholds. Each module has a different type of value: number, percentage, or size.

### Threshold

As mentioned, thresholds can be described for the three different types of module values:

- The _number_ type is the simplest where the number is just a number or a score. The _lighthouse_ module uses numbers as scores.
- The _percentage_ type is percentage based being from 0% to 100%. The _unused-source_ module uses percentages to show how much of a file is unused.
- The _size_ type is for file and directory sizes in bytes. The threshold can describe thresholds for each type. The `heap-snapshot` and `size` modules show file and directory sizes.

There may be times where the difference of the last value and the current value is within the threshold that may still need to be fail. For this, there is a `diffPercentage` value. This allows the difference to be checked against the last value to see if the difference is more than a percentage of the last value. So if the last value is 100, the difference was 2 this means the diff percentage is 2% and while that 2 may be under the threshold, it may be more than you want to allow through without some sort of warning or even a failure.

### Default Configuration

```yaml
plugins:
  - plugin: @modus/gimbal-plugin-last-value
  failOnBreak: false
  saveOnlyOnSuccess: true
  threshold:
    diffPercentage: 2
    number: 1
    percentage: 1
    size: 1000
```

## Storage

This plugin only does calculation on the Gimbal audit run, the data for the last value needs to come from another plugin. Gimbal has some plugins available but you can provide your own as well.

- [mysql](https://www.npmjs.com/package/@modus/gimbal-plugin-mysql)
- [sqlite](https://www.npmjs.com/package/@modus/gimbal-plugin-sqlite)

This plugin expects an array of rows in this format:

```json
[
  {
    "command": "audit",
    "date": "2019-01-01 01:00:00",
    "audit": "{...}"
  }
]
```

The `date` field isn't needed by this plugin but is a good way for the storage plugin to be able to get the last run. The `command` field allows for some segregation of reports in case you run different commands. This would be like `audit` or `size` and is the same as if you executed `gimbal audit` on the command line. The `audit` field is a JSON blob that is the raw Gimbal audit report. If the `audit` field is a string, this plugin will attempt to `JSON.parse()` the value to get the JavaScript object.

This plugin will fire two events to get and save last value reports. The plugin would need to listen to them to support this plugin:

```javascript
module.exports = ({ event }, pluginConfig) => {
  event.on('plugin/last-value/report/get', (eventName, { command }) => getLastValue(command));

  event.on('plugin/last-value/report/save', (eventName, { command, report }) => saveLastValue(command, report));
};
```
