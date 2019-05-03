# Gimbal Documentation

Thanks for visiting the documentation for Gimbal! Here we'll discuss in more depth how to use Gimbal, how to configure it and even how to work on Gimbal itself.

## Architecture

Gimbal is split up into different chunks:

- [ci](./ci): Gimbal will be executed frequently in different CIs and we may need to detect which CI we are running in.
- [command](./command): This is the entry point into running things within Gimbal.
- [config](./config): Handles loading and parsing configuration files.
- [event](./event): Gimbal fires events internally that allows other things to listen to and enact on.
- [logger](./logger): Gimbal logs messages out and the logger is what handles this.
- [module](./module): Modules are the actual things that run different audits.
- [output](./output): As the name suggests, these will output to the cli and to files on disk.
- [utils](./utils): A location of other utilities.
- [vcs](./vcs): Like `ci`, this is where we can autodetect and enact on things on a per VCS basis.
