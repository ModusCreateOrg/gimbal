import deepmerge from 'deepmerge';
import { addColumn } from './render';
import { getLastReport, saveReport } from './storage';
import { ActionEndEvent, EndEvent } from '@/typings/command';
import { PluginOptions } from '@/typings/config/plugin';
import { Config, InspectCallback } from '@/typings/plugin/last-value';
import { CliReportEndEvent } from '@/typings/output';
import { CommandOptions } from '@/typings/utils/command';

const defaultConfig: Config = {
  failOnBreach: false,
  saveOnlyOnSuccess: true,
  thresholds: {
    diffPercentage: 2,
    number: 1,
    percentage: 1,
    size: 1000,
  },
};

type EventRet = void | Promise<void>;

const inspectCommandOptions = (commandOptions: CommandOptions, callback: InspectCallback): void | Promise<void> => {
  if (commandOptions.checkLastValues) {
    return callback();
  }

  return undefined;
};

const LastValue = async ({ event, program }: PluginOptions, config: Config): Promise<void> => {
  const pluginConfig = deepmerge(defaultConfig, config);

  program.option('--no-check-last-values', 'Set to disable checking last values vs current values.', true);

  event.on(
    'output/cli/report/end',
    (name: string, { commandOptions, table }: CliReportEndEvent): EventRet =>
      inspectCommandOptions(commandOptions, (): void => addColumn(table, pluginConfig)),
  );

  event.on(
    'output/markdown/render/table/start',
    (name: string, { commandOptions, table }: CliReportEndEvent): EventRet =>
      inspectCommandOptions(commandOptions, (): void => addColumn(table, pluginConfig)),
  );

  event.on(
    'command/*/action/end',
    (name: string, { commandOptions, report }: ActionEndEvent): EventRet =>
      inspectCommandOptions(commandOptions, (): Promise<void> => getLastReport(name, pluginConfig, report, event)),
  );

  event.on(
    'command/*/end',
    (name: string, { commandOptions, report }: EndEvent): EventRet =>
      inspectCommandOptions(commandOptions, (): Promise<void> => saveReport(name, pluginConfig, report, event)),
  );
};

export default LastValue;
