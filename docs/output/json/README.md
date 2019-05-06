# Gimbal JSON Report

Gimbal can write the raw JSON blob of all the audits that were just run. If multiple audits were run, these will all be located in a single JSON file.

## Usage

You can tell Gimbal to write this file out using the configuration file:

```yaml
outputs:
  json: ./artifacts/gimbal.json
```

Or via cli:

```shell
$ gimbal --output-json ./artifacts/gimbal.json
```

These paths are relative to where gimbal is being executed or being told to execute.
