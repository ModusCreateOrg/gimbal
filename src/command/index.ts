import { Cell, GenericTable } from 'cli-table3';
import program, { Command as CommandType } from 'commander';
import figlet from 'figlet';
import path from 'path';
import Config from '@/config';
import Logger from '@/logger';
import { CommandReturn, Report } from '@/typings/command';
import { CommandOptions } from '@/typings/utils/command';
import { getOptionsFromCommand } from '@/utils/command';
import { readDir, stats } from '@/utils/fs';

/* eslint-disable-next-line @typescript-eslint/no-explicit-any */
type Action = (commandOptions: CommandOptions, args?: string[]) => Promise<any>;
type ActionCreatorArg = string[] | CommandType;
type ActionCreator = (...actionArgs: ActionCreatorArg[]) => Promise<void>;
type DefaultValueFn = (options: CommandOptions) => CommandOptions;
type OutputRet = void | GenericTable<Cell[]>;
/* eslint-disable-next-line @typescript-eslint/no-explicit-any */
type Output = (reports: any, options: CommandOptions) => Promise<OutputRet> | OutputRet;

interface Option {
  defaultValue?: string | DefaultValueFn;
  description?: string;
  flag: string;
}

interface Config {
  action: Action;
  command: string;
  options?: Option[];
  output?: Output;
  title: string;
}

class Command {
  private action: Action;

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
    return async (...actionArgs: ActionCreatorArg[]): Promise<void> => this.run(...actionArgs);
  }

  public async run(...actionArgs: ActionCreatorArg[]): Promise<void> {
    let cmd: CommandType;
    let args: string[] = [];

    if (actionArgs.length === 1) {
      cmd = actionArgs[0] as CommandType;
    } else {
      args = actionArgs[0] as string[];
      cmd = actionArgs[1] as CommandType;
    }

    try {
      const commandOptions = getOptionsFromCommand(cmd);

      if (!Config.isLoaded) {
        await Config.load(commandOptions.cwd);
      }

      const report: CommandReturn | Report = await this.action(commandOptions, args);

      Logger.log(figlet.textSync(this.title));

      if (this.output) {
        await this.output(report, commandOptions);
      }

      if (!report.success) {
        process.exit(1);
      }
    } catch (error) {
      Logger.log(error);

      process.exit(1);
    }
  }
}

export const preparseOptions = (): CommandOptions => {
  const parsed = program.parseOptions(program.normalize(process.argv.slice(2)));
  const cmd = parsed.args[0]
    ? program.commands.find((command: CommandType): boolean => command.name() === parsed.args[0])
    : program;

  cmd.parseOptions(parsed.args); // this applies option values onto the command/program

  return getOptionsFromCommand(cmd);
};

export default Command;
