import logger from '@modus/gimbal-core/lib/logger';
import buildOptions, { Options } from 'minimist-options';
import minimist, { ParsedArgs } from 'minimist';

interface ArgCache {
  args: ParsedArgs;
  options: Options;
}

class Cli {
  private argCache?: ArgCache;

  private options: Options = {};

  public add(newOptions: Options): this {
    const { options } = this;
    let hasOption = false;

    Object.keys(newOptions).every((option: string): boolean => {
      if (options[option] === undefined) {
        return true;
      }

      logger.log(`${option} is already set: ${JSON.stringify(options[option])}`);

      hasOption = true;

      return false;
    });

    if (hasOption) {
      throw new Error('Duplicate CLI option being used.');
    }

    const mergedOptions: Options = {
      ...options,
      ...newOptions,
    };

    logger.verbose('Setting new CLI options...');
    logger.verbose(`  Old Options: ${JSON.stringify(options)}`);
    logger.verbose(`  New Options: ${JSON.stringify(newOptions)}`);
    logger.verbose(`  Merged Options: ${JSON.stringify(mergedOptions)}`);

    this.options = mergedOptions;

    this.getArgs(true);

    return this;
  }

  public get args(): ParsedArgs {
    if (this.argCache) {
      logger.verbose('Returning cli args from argCache');

      return this.argCache.args;
    }

    const cliArgs = process.argv.slice(2);
    const options = buildOptions(this.options);
    const args = minimist(cliArgs, options);
    const parsedArgs = this.parseArgs(args);

    logger.verbose('Building new cli args...');
    logger.verbose(`  Options: ${JSON.stringify(this.options)}`);
    logger.verbose(`  process.argv: ${JSON.stringify(cliArgs)}`);
    logger.verbose(`  args: ${JSON.stringify(args)}`);
    logger.verbose(`  parsed args: ${JSON.stringify(parsedArgs)}`);

    logger.verbose('Saving cli args to cache');

    this.argCache = {
      args,
      options: this.options,
    };

    return args;
  }

  public getArgs(force = false): ParsedArgs {
    if (this.argCache) {
      if (force) {
        // clear the cache so it builds new args cache
        this.argCache = undefined;
      } else {
        logger.verbose('Returning cli args from argCache');

        return this.argCache.args;
      }
    }

    return this.args;
  }

  private parseArgs(args: ParsedArgs): ParsedArgs {
    Object.keys(args).forEach((arg: string): void => {
      if (arg.search('-') !== -1) {
        const parsed = arg.replace(/-(\w+)/g, (fullMatch: string, match: string): string => {
          return match.substr(0, 1).toUpperCase() + match.substr(1);
        });

        if (args[parsed] == null) {
          /* eslint-disable-next-line no-param-reassign */
          args[parsed] = args[arg];
        }
      }
    });

    return args;
  }
}

export default new Cli();
