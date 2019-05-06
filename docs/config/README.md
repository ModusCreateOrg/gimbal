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
