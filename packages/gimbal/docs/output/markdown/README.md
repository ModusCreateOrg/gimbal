# Gimbal Markdown Report

Gimbal can output simple tables as a report. If a command executed with multiple modules, each module will be its own table and each table will have a label, the value, the threshold and a success column.

## Usage

You can tell Gimbal to write this file out using the configuration file:

```yaml
outputs:
  markdown: ./artifacts/gimbal.md
```

Or via cli:

```shell
$ gimbal --output-markdown ./artifacts/gimbal.md
```

These paths are relative to where gimbal is being executed or being told to execute.
