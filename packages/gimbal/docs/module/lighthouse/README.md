# Gimbal Lighthouse Module

The Google Lighthouse project aims at auditing a web application. Gimbal uses it as one of it's modules of performance measuring.

## Configuration

The configuration can accept any configuration that Lighthouse has as described [here](https://github.com/GoogleChrome/lighthouse/blob/master/docs/configuration.md). The `configs.lighthouse` namespace should be used within a configuration file:

### YAML

```yaml
configs:
  lighthouse:
    extends: lighthouse:default
```

### JSON

```json
{
  "configs": {
    "lighthouse": {
      "extends": "lighthouse:default"
    }
  }
}
```

### JavaScript

```javascript
module.exports = {
  configs: {
    lighthouse: {
      extends: 'lighthouse:default',
    },
  },
};
```

### Default Configuration

```json
{
  "extends": "lighthouse:default",
  "settings": {
    "skipAudits": ["uses-http2", "redirects-http", "uses-long-cache-ttl"]
  }
}
```

The reason why it skips these audits is that the Lighthouse module isn't going to be running against your production environment but only a local simple web server and therefor these audits are meaningless.

## Thresholds

Each category of the Lighthouse report can be configured with

```yaml
configs:
  lighthouse:
    threshold:
      accessibility: 75,
      best-practices: 95,
      performance: 50,
      pwa: 50,
      seo: 90,
```

The default threshold is:

```yaml
configs:
  lighthouse:
    threshold:
      accessibility: 75,
      best-practices: 95,
      performance: 50,
      pwa: 50,
      seo: 90,
```
