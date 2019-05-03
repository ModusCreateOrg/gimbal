# Gimbal Publishing

Gimbal is a node module that is published to the [npmjs](https://www.npmjs.com/) repository. In order to publish, the [`npm version`](https://docs.npmjs.com/cli/version.html) command is used to bump the version. Once the git ag is pushed, CircleCI will automatically trigger publishing to the npm repository:

```shell
$ npm version patch
$ git push --follow-tags
```

This will bump the patch version up so if the current version is `1.1.1`, the new version will be `1.1.2`. Please see the [`npm version`](https://docs.npmjs.com/cli/version.html) docs to see how to bump the version to a different version such as a new major or a specific version.
