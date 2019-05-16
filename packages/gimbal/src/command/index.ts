import program, { Command as CommandType } from 'commander';
import figlet from 'figlet';
import path from 'path';
import Config from '@/config';
import EventEmitter from '@/event';
import Logger from '@/logger';
import output from '@/output';
import { StartEvent, EndEvent, ActionStartEvent, ActionEndEvent, Report } from '@/typings/command';
import { CommandOptions } from '@/typings/utils/command';
import { getOptionsFromCommand } from '@/utils/command';
import { readDir, stats } from '@/utils/fs';
import comment from '@/vcs/comment';

/* eslint-disable-next-line @typescript-eslint/no-explicit-any */
type Action = (commandOptions: CommandOptions, args?: string[]) => Promise<any>;
type ActionCreatorArg = string[] | CommandType;
type ActionCreator = (...actionArgs: ActionCreatorArg[]) => Promise<void>;
type DefaultValueFn = (options: CommandOptions) => CommandOptions;

interface Option {
  defaultValue?: string | DefaultValueFn;
  description?: string;
  flag: string;
}

interface Config {
  action: Action;
  command: string;
  options?: Option[];
  title: string;
}

class Command {
  private action: Action;

  private command: string;

  private options?: Option[];

  private title: string;

  public static async registerCommands(): Promise<void[]> {
    const commands = await readDir(__dirname);

    return Promise.all(
      commands.map(
        async (item: string): Promise<void> => {
          const itemPath = path.join(__dirname, item);
          const itemStats = await stats(itemPath);

          return itemStats.isDirectory() ? import(`./${item}/program`) : undefined;
        },
      ),
    );
  }

  public constructor(config: Config) {
    this.action = config.action;
    this.command = config.command;
    this.options = config.options;
    this.title = config.title;

    this.create();
  }

  private create(): void {
    const { options } = this;

    const cmd = program.command(this.command);

    if (options) {
      options.forEach(
        (option: Option): void => {
          cmd.option(option.flag, option.description, option.defaultValue);
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

      const startEvent: StartEvent = {
        args,
        commandOptions,
        command: this,
      };

      await EventEmitter.fire(`command/${this.command}/start`, startEvent);

      if (!Config.isLoaded) {
        await Config.load(commandOptions.cwd, commandOptions);
      }

      const actionStartEvent: ActionStartEvent = {
        args,
        commandOptions,
        command: this,
      };

      await EventEmitter.fire(`command/${this.command}/action/start`, actionStartEvent);

      const report: Report = await this.action(commandOptions, args);

      const actionEndEvent: ActionEndEvent = {
        args,
        commandOptions,
        command: this,
        report,
      };

      await EventEmitter.fire(`command/${this.command}/action/end`, actionEndEvent);

      Logger.log(figlet.textSync(this.title));

      await output(report, commandOptions);

      await comment(report, commandOptions);

      const endEvent: EndEvent = {
        args,
        commandOptions,
        command: this,
        report,
      };

      await EventEmitter.fire(`command/${this.command}/end`, endEvent);

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
  const match =
    parsed.args[0] && program.commands.find((command: CommandType): boolean => command.name() === parsed.args[0]);
  const cmd = match || program;

  if (!match && parsed.args[0]) {
    Logger.log(`The "${parsed.args[0]}" command was not found`);
  }

  cmd.parseOptions(parsed.args); // this applies option values onto the command/program

  return getOptionsFromCommand(cmd);
};

export default Command;
