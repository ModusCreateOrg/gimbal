# Gimbal Publishing

Gimbal is a node module that is published to the [npmjs](https://www.npmjs.com/) repository. In order to publish, the [`lerna version`](https://github.com/lerna/lerna/tree/master/commands/version) command is used to bump the version. Once the git ag is pushed, CircleCI will automatically trigger publishing to the npm repository:

```shell
$ yarn run version
```

This will execute:

```shell
$ lerna version patch --exact --yes
```

This will bump the patch version up so if the current version is `1.1.1`, the new version will be `1.1.2`. Please see the [`lerna version`](https://github.com/lerna/lerna/tree/master/commands/version) docs to see how to bump the version to a different version such as a new major or a specific version.
