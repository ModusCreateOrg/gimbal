import program, { Command as CommandType } from 'commander';
import figlet from 'figlet';
import path from 'path';
import Config from '@/config';
import { CliOutputOptions } from '@/typings/output/cli';
import { CommandOptions } from '@/typings/utils/command';
import { getOptionsFromCommand } from '@/utils/command';
import { readDir, stats } from '@/utils/fs';
import log from '@/utils/logger';

/* eslint-disable-next-line @typescript-eslint/no-explicit-any */
type Action = (commandOptions: CommandOptions, args?: string[]) => Promise<any>;
type ActionCreatorArg = string[] | CommandType;
type ActionCreator = (...actionArgs: ActionCreatorArg[]) => Promise<void>;
type DefaultValueFn = (options: CommandOptions) => CommandOptions;
/* eslint-disable-next-line @typescript-eslint/no-explicit-any */
type Output = (reports: any, commandOptions: CommandOptions, options?: CliOutputOptions) => Promise<void> | void;

interface Option {
  defaultValue?: string | DefaultValueFn;
  description?: string;
  flag: string;
}

interface Config {
  action: Action;
  cliOutput?: Output;
  command: string;
  options?: Option[];
  output?: Output;
  title: string;
}

class Command {
  private action: Action;

  private cliOutput?: Output;

  private command: string;

  private options?: Option[];

  private output?: Output;

  private title: string;

  public static async registerCommands(): Promise<void[]> {
    const commands = await readDir(__dirname);

    return Promise.all(
      commands.map(
        async (item: string): Promise<void> => {
          const itemPath = path.join(__dirname, item);
          const itemStats = await stats(itemPath);

          return itemStats.isDirectory() ? import(`@/command/${item}/program`) : undefined;
        },
      ),
    );
  }

  public constructor(config: Config) {
    this.action = config.action;
    this.cliOutput = config.cliOutput;
    this.command = config.command;
    this.options = config.options;
    this.output = config.output;
    this.title = config.title;

    this.create();
  }

  private create(): void {
    const { options } = this;

    const cmd = program.command(this.command);

    if (options) {
      options.forEach(
        (option: Option): void => {
          cmd.option(option.flag, option.description);
        },
      );
    }

    cmd.action(this.createAction());
  }

  private createAction(): ActionCreator {
    return async (...actionArgs: ActionCreatorArg[]): Promise<void> => {
      return this.run(...actionArgs);
    };
  }

  public async run(...actionArgs: ActionCreatorArg[]): Promise<void> {
    let cmd: CommandType;
    let args: string[] = [];
    let hasFailure: Error | boolean = false;
    /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
    let reports: any;

    if (actionArgs.length === 1) {
      cmd = actionArgs[0] as CommandType;
    } else {
      args = actionArgs[0] as string[];
      cmd = actionArgs[1] as CommandType;
    }

    const commandOptions = getOptionsFromCommand(cmd);

    if (!Config.isLoaded) {
      await Config.load(commandOptions.cwd);
    }

    try {
      reports = await this.action(commandOptions, args);
    } catch (error) {
      hasFailure = error;
    }

    log(figlet.textSync(this.title));

    if (this.cliOutput) {
      this.cliOutput(reports, commandOptions);
    }

    if (this.output) {
      await this.output(reports, commandOptions);
    }

    if (hasFailure) {
      // need to prettify the error?
      /* eslint-disable-next-line no-console */
      console.log(hasFailure);

      process.exit(1);
    }
  }
}

export default Command;
