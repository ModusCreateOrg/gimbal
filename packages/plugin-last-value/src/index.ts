import deepmerge from 'deepmerge';
import { addColumn } from './render';
import { getLastReport, saveReport } from './storage';
import { ActionEndEvent, EndEvent } from '@/typings/command';
import { PluginOptions } from '@/typings/config/plugin';
import { Context } from '@/typings/context';
import { Config, InspectCallback } from '@/typings/plugin/last-value';
import { CliReportEndEvent } from '@/typings/output';

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

const inspectArgs = (context: Context, callback: InspectCallback): void | Promise<void> => {
  if (context.config.get('configs.checkLastValues')) {
    return callback();
  }

  return undefined;
};

const LastValue = async (pluginOptions: PluginOptions, config: Config): Promise<void> => {
  const { context } = pluginOptions;
  const pluginConfig = deepmerge(defaultConfig, config || {});

  context.args.add({
    'check-last-values': {
      default: true,
      type: 'boolean',
    },
  });

  context.event.on('output/cli/report/end', (name: string, { table }: CliReportEndEvent) =>
    inspectArgs(context, (): void => addColumn(table, pluginOptions, pluginConfig)),
  );

  context.event.on(
    'output/markdown/render/table/start',
    (name: string, { table }: CliReportEndEvent): EventRet =>
      inspectArgs(context, (): void => addColumn(table, pluginOptions, pluginConfig)),
  );

  context.event.on(
    'command/*/action/end',
    (name: string, { report }: ActionEndEvent): EventRet =>
      inspectArgs(context, (): Promise<void> => getLastReport(name, pluginOptions, pluginConfig, report)),
  );

  context.event.on(
    'command/*/end',
    (name: string, { report }: EndEvent): EventRet =>
      inspectArgs(context, (): Promise<void> => saveReport(name, pluginConfig, report, context)),
  );
};

export default LastValue;
