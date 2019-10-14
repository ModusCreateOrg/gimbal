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

### Lighthouse config

You can pass [Lighthouse configuration](https://github.com/GoogleChrome/lighthouse/blob/master/docs/configuration.md) straight to the `lighthouse` object:

```yaml
configs:
  lighthouse:
    maxWaitForFcp: 120000;
    outputHtml: artifacts/lighthouse.html
```

## Audits

A configuration file can specify what specific audits to run. With this, you can just run `gimbal` in the directory where the configuration file is in and it will only run those audits. For example, if you wanted to run the lighthouse and size audits, you would specify the `audits` array:

```yaml
audits:
  - lighthouse
  - size
```
