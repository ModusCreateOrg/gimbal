```
      ___                       ___                         ___
     /\__\                     /\  \         _____         /\  \
    /:/ _/_       ___         |::\  \       /::\  \       /::\  \
   /:/ /\  \     /\__\        |:|:\  \     /:/\:\  \     /:/\:\  \
  /:/ /::\  \   /:/__/      __|:|\:\  \   /:/ /::\__\   /:/ /::\  \   ___     ___
 /:/__\/\:\__\ /::\  \     /::::|_\:\__\ /:/_/:/\:|__| /:/_/:/\:\__\ /\  \   /\__\
 \:\  \ /:/  / \/\:\  \__  \:\~~\  \/__/ \:\/:/ /:/  / \:\/:/  \/__/ \:\  \ /:/  /
  \:\  /:/  /     \:\/\__\  \:\  \        \::/_/:/  /   \::/__/       \:\  /:/  /
   \:\/:/  /       \::/  /   \:\  \        \:\/:/  /     \:\  \        \:\/:/  /
    \::/  /        /:/  /     \:\__\        \::/  /       \:\__\        \::/  /
     \/__/         \/__/       \/__/         \/__/         \/__/         \/__/

  _                 __  __               _                    ____                         _
 | |__    _   _    |  \/  |   ___     __| |  _   _   ___     / ___|  _ __    ___    __ _  | |_    ___
 | '_ \  | | | |   | |\/| |  / _ \   / _` | | | | | / __|   | |     | '__|  / _ \  / _` | | __|  / _ \
 | |_) | | |_| |   | |  | | | (_) | | (_| | | |_| | \__ \   | |___  | |    |  __/ | (_| | | |_  |  __/
 |_.__/   \__, |   |_|  |_|  \___/   \__,_|  \__,_| |___/    \____| |_|     \___|  \__,_|  \__|  \___|
          |___/
```

[![CircleCI](https://circleci.com/gh/ModusCreateOrg/webperf-ci.svg?style=svg)](https://circleci.com/gh/ModusCreateOrg/webperf-ci)

## Development

- Clone the repository
- Run `npm install`
- Run `npm start` or `yarn start`

This should show the help screen.

### CLI

To run a command, you can pass the different arguments after `--`:

```bash
npm start -- cra --cwd ../test-react-app
yarn start -- cra --cwd ../test-react-app
```

To get the help screen of a command, use the `--help` option:

```bash
npm start -- cra --help
yarn start -- cra --help
```

### CLI Debug

Like the `start` script, there are also `start:debug` and `start:break` that will allow the node process
to be connected to by programs that support node debugging like Chrome or Webstorm. Since this is a CLI
application, `start:break` script is likely the one that should be used as it uses node's `--inspect-brk`
option which will stop the node application at the start. That way you can connect a program to the node
process and play it so you can step through the code.

To actually use it, just replace `start` with `start:break` in the examples above:

```bash
npm run start:break -- cra --cwd ../test-react-app
yarn start:break -- cra --cwd ../test-react-app
```

### VSCode

There are a few launch configs already setup to be able to run different commands. You can go to the Debug
section of VSCode, choose the launch config you want and press the green play button. This allows you to set
breakpoints and `debugger;` to step through the code within VSCode. You can look at [.vscode/launch.json](.vscode/launch.json) for more.

## Building and Testing

- Run `npm run build`
- Run `npm link`
- Run `gimbal` from anywhere in your machine
- Run `gimbal --help` for reviewing help
