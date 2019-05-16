# Gimbal Size Module

The `size` module can take an array of glob paths, resolve files and directories and check the sizes against the configured maximum size. Files are also checked for their gzip (can also use brotli compression or no compression) size instead of their raw size as their gzip size would be what would be downloaded by the browser.

## Configuration

By default, there are no extra configurations needed. If you would like to use a different compression other than the gzip, you can use the `configs.size` namespace in a configuration file:

### YAML

```yaml
configs:
  size:
    compression: brotli
```

### JSON

```json
{
  "configs": {
    "size": {
      "compression": false
    }
  }
}
```

## JavaScript

```javascript
modules.exports = {
  configs: {
    size: {
      compression: 'brotli',
    },
  },
};
```

## Thresholds

The size module can take an array of objects. Each object should have a `path` and a `maxSize` property:

```yaml
configs:
  size:
    - path: ./build/precache-*.js
      maxSize: 500 B
    - path: ./build/static/js/*.chunk.js
      maxSize: 1 MB
    - path: ./build/static/js/runtime*.js
      maxSize: 10 KB
    - path: ./build/
      maxSize: 18 MB
```

The `path` is a glob syntax (we use [globby](https://www.npmjs.com/package/globby) to find matching files and directories) that is relative to the directory gimbal is executed in or told to execute in. The `maxSize` is a string specify the size the matching files and directories should be under.

Notice how the `config.size` namespace can take an object or an array. If an array is returned, it is turned into an object so the above threshold configuration would be the same as passing:

```yaml
configs:
  size:
    threshold:
      - path: ./build/precache-*.js
        maxSize: 500 B
      - path: ./build/static/js/*.chunk.js
        maxSize: 1 MB
      - path: ./build/static/js/runtime*.js
        maxSize: 10 KB
      - path: ./build/
        maxSize: 18 MB
```

### Default Threshold

```yaml
configs:
  size:
    - path: ./build/static/css/main.*.chunk.css
      maxSize: 5 KB
    - path: ./build/static/js/main.*.chunk.js
      maxSize: 5 KB
    - path: ./build/static/js/*.chunk.js
      maxSize: 150 KB
    - path: ./build/static/js/runtime*.js
      maxSize: 5 KB
    - path: ./build/static/media/logo*.svg
      maxSize: 3 KB
    - path: ./build/favicon.ico
      maxSize: 4 KB
    - path: ./build/index.html
      maxSize: 3 KB
    - path: ./build/manifest.json
      maxSize: 500 B
    - path: ./build/precache-*.js
      maxSize: 1 KB
    - path: ./build/service-worker.js
      maxSize: 1.2 KB
    - path: ./build/
      maxSize: 500 KB
```

This default threshold configuration is meant to allow a create-react-app generated application to pass. Your application may vary and you may need to configure your thresholds to sensible limits.
