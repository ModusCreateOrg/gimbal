import deepmerge from 'deepmerge';
import { addColumn } from '@/plugin/last-value/render';
import { getLastReport, saveReport } from '@/plugin/last-value/storage';
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

const inspectCommandOptions = (commandOptions: CommandOptions, callback: InspectCallback): void | Promise<void> => {
  if (commandOptions.checkLastValues) {
    return callback();
  }

  return undefined;
};

module.exports = async ({ event, program }: PluginOptions, config: Config): Promise<void> => {
  const pluginConfig = deepmerge(defaultConfig, config);
  program.option('--no-check-last-values', 'Set to disable checking last values vs current values.', true);

  event.on(
    'output/cli/report/end',
    (eventName: string, { commandOptions, table }: CliReportEndEvent): void | Promise<void> =>
      inspectCommandOptions(commandOptions, (): void => addColumn(table, pluginConfig)),
  );

  event.on(
    'command/*/action/end',
    (eventName: string, { commandOptions, report }: ActionEndEvent): void | Promise<void> =>
      inspectCommandOptions(commandOptions, (): Promise<void> => getLastReport(eventName, pluginConfig, report)),
  );

  event.on(
    'command/*/end',
    (eventName: string, { commandOptions, report }: EndEvent): void | Promise<void> =>
      inspectCommandOptions(commandOptions, (): Promise<void> => saveReport(eventName, pluginConfig, report)),
  );
};
