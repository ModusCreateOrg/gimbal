# Gimbal Configuration

Gimbal aims to make auditing an application as simple and as configuration free as possible but no two applications are exactly the same. Gimbal provides the mechanism to easily configure it using a configuration file.

## Usage

To use a configuration file, where gimbal is being executed at should contain a `.gimbalrc.yml`, `.gimbalrc.yaml`, `.gimbalrc.json`, or `.gimbalrc.js` file. Here are some examples:

### YAML

```yaml
configs:
  puppeteer:
    headless: false

outputs:
  json: ./artifact/gimbal.json
```

### JSON

```json
{
  "configs": {
    "puppeteer": {
      "headless": false
    }
  },
  "outputs": {
    "json": "./artifact/gimbal.json"
  }
}
```

### JavaScript (simple)

```javascript
module.exports = {
  configs: {
    puppeteer: {
      headless: false,
    },
  },
  outputs: {
    json: './artifact/gimbal.json',
  },
};
```

### JavaScript (functional/async)

```javascript
module.exports = async () => {
  const configs = await getGimbalConfigs();
  const outputs = await getGimbalOutputs();

  return {
    configs,
    outputs,
  };
};
```

## Jobs

A configuration file can also specify what commands to run. This means, if you have a configuration file that specifies what jobs, then all you need to do is execute `gimbal` in that directory and Gimbal will run those commands for you. Example:

```yaml
jobs:
  - audit
  - size --cwd ./foo/bar
```
