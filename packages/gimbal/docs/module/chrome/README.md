# Gimbal Chrome Module

Gimbal uses the [puppeteer](https://pptr.dev/) project to launch a headless Chrome instance. This is meant to only be used by modules or commands to start a browser in order for audits that require a browser.

## Configuration

Gimbal can accept any configurations that puppeteer's [`launch`](https://github.com/GoogleChrome/puppeteer/blob/master/docs/api.md#puppeteerlaunchoptions) method accepts. The `configs.puppeteer` namespace should be used within a configuration file:

### YAML

```yaml
configs:
  puppeteer:
    headless: false
```

### JSON

```json
{
  "configs": {
    "puppeteer": {
      "headless": false
    }
  }
}
```

### JavaScript

```javascript
module.exports = {
  configs: {
    puppeteer: {
      headless: false,
    },
  },
};
```

### Default Configuration

```json
{
  "args": ["--no-sandbox", "–-disable-setuid-sandbox"]
}
```
