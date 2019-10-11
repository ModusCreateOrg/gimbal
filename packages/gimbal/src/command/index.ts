import program, { Command as CommandType } from 'commander';
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
}

class Command {
  private action: Action;

  private command: string;

  public constructor(config: Config) {
    this.action = config.action;
    this.command = config.command;
  }

  public async run(args: string[] = []): Promise<void> {
    try {
      const commandOptions = getOptionsFromCommand(program, undefined, Config);

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
