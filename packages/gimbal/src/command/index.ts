import { readDir, stats } from '@modus/gimbal-core/lib/utils/fs';
import program, { Command as CommandType } from 'commander';
import path from 'path';
import Config from '@/config';
import EventEmitter from '@/event';
import Logger from '@/logger';
import output from '@/output';
import { StartEvent, EndEvent, ActionStartEvent, ActionEndEvent, Report } from '@/typings/command';
import { CommandOptions } from '@/typings/utils/command';
import { getOptionsFromCommand } from '@/utils/command';
import comment from '@/vcs/comment';
import reconcileReports from './reconcile';

/* eslint-disable-next-line @typescript-eslint/no-explicit-any */
type Action = (commandOptions: CommandOptions, args?: string[]) => Promise<any>;
type ActionCreatorArg = string[] | CommandType;
type ActionCreator = (...actionArgs: ActionCreatorArg[]) => Promise<void>;
type DefaultValueFn = (options: CommandOptions) => CommandOptions;

interface Option {
  /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
  defaultValue?: any | DefaultValueFn;
  description?: string;
  flag: string;
  /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
  process?: ((arg1: any, arg2: any) => void) | RegExp;
}

interface Config {
  action: Action;
  command: string;
  deprecated?: boolean;
  options?: Option[];
}

class Command {
  private action: Action;

  private command: string;

  private deprecated?: boolean;

  private options?: Option[];

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
    this.deprecated = config.deprecated;
    this.options = config.options;

    this.create();
  }

  private create(): void {
    const { options } = this;

    const cmd = program.command(this.command);

    if (options) {
      options.forEach((option: Option): void => {
        if (option.process) {
          cmd.option(option.flag, option.description, option.process, option.defaultValue);
        } else {
          cmd.option(option.flag, option.description, option.defaultValue);
        }
      });
    }

    cmd.action(this.createAction());
  }

  private createAction(): ActionCreator {
    return async (...actionArgs: ActionCreatorArg[]): Promise<void> => this.run(...actionArgs);
  }

  public async run(...actionArgs: ActionCreatorArg[]): Promise<void> {
    let cmd: CommandType;
    let args: string[] = [];

    if (this.deprecated) {
      Logger.log(
        `The "${this.command}" command is deprecated and will be removed soon. Please use the "audit" config in a configuration file. See: https://github.com/ModusCreateOrg/gimbal/tree/master/packages/gimbal/docs/config`,
      );
    }

    if (actionArgs.length === 1) {
      cmd = actionArgs[0] as CommandType;
    } else {
      args = actionArgs[0] as string[];
      cmd = actionArgs[1] as CommandType;
    }

    try {
      const commandOptions = getOptionsFromCommand(cmd, undefined, Config);

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

      const reports: Report | Report[] = await this.action(commandOptions, args);
      const report: Report = reconcileReports(reports);

      const actionEndEvent: ActionEndEvent = {
        args,
        commandOptions,
        command: this,
        report,
      };

      await EventEmitter.fire(`command/${this.command}/action/end`, actionEndEvent);

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

  return getOptionsFromCommand(cmd, undefined, Config);
};

export default Command;
