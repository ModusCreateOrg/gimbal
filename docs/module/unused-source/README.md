# Gimbal Unused-Source Module

The `unused-source` module is aimed to find CSS and JavaScript code that is unused. When a page is loaded, puppeteer returns ranges of all the CSS and JavaScript assets that tells Gimbal how much of each is used.

## Configuration

There are no configurations for this module.

## Thresholds

Using a glob syntax, assets are matched using an array of objects with `path` and `maxSize` thresholds. The `maxSize` threshold is the percentage of unused source for each asset.

An object can also take a `type` configuration to be able to properly match different sources in the same file. For example, there could be inline JavaScript and CSS in a single HTML page. If you have the same path for two objects, it's important the order they are in the array as the first match will be used.

### Default Threshold

```yaml
configs:
  unused-source:
    threshold:
      - path: '**/*/*.css'
        maxSize: 30%
      - path: '**/*/main.*.js'
        maxSize: 2%
      - path: '**/*/*.js'
        maxSize: 40%
      - path: /
        maxSize: 25%
        type: js
      - path: /
        maxSize: 40%
```

This default threshold configuration is meant to allow a create-react-app generated application to pass. Your application may vary and you may need to configure your thresholds to sensible limits. These also may seem low but this is only testing the index page. Routes may be added at a later date that will help here.
