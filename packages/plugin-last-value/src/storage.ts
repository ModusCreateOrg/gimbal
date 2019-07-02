import Queue from '@modus/gimbal-core/lib/utils/Queue';
import { doesItemFail, getItemDiff } from './util';
import { Report, ReportItem } from '@/typings/command';
import { PluginOptions } from '@/typings/config/plugin';
import { Emitter } from '@/typings/event';
import { Config, LastReportItem, GetEvent, SaveEvent } from '@/typings/plugin/last-value';

const applyRow = async (
  archiveItem: LastReportItem,
  config: Config,
  report: Report,
  pluginOptions: PluginOptions,
): Promise<void> => {
  const { failOnBreach } = config;
  const parent = report.data && report.data.find((item: ReportItem): boolean => item.type === archiveItem.type);

  if (parent && parent.data && archiveItem.data) {
    let { success } = parent;

    await Promise.all(
      parent.data.map(
        async (item: ReportItem): Promise<void> => {
          const match =
            archiveItem.data &&
            archiveItem.data.find((archiveChild: ReportItem): boolean => archiveChild.rawLabel === item.rawLabel);

          if (match) {
            /* eslint-disable-next-line no-param-reassign */
            item.lastValue = match.value;
            /* eslint-disable-next-line no-param-reassign */
            item.rawLastValue = match.rawValue;

            const diffInfo = await getItemDiff(item as LastReportItem, pluginOptions);

            if (diffInfo) {
              /* eslint-disable-next-line no-param-reassign */
              (item as LastReportItem).lastValueChange = diffInfo.change;
              /* eslint-disable-next-line no-param-reassign */
              (item as LastReportItem).lastValueDiff = diffInfo.diff;
            }

            if (failOnBreach && item.success) {
              const itemFail = await doesItemFail(item as LastReportItem, config, pluginOptions);

              /* eslint-disable-next-line no-param-reassign */
              item.success = !itemFail;

              if (success) {
                /* eslint-disable-next-line prefer-destructuring */
                success = item.success;
              }
            }
          }
        },
      ),
    );

    if (failOnBreach) {
      parent.success = success;
      /* eslint-disable-next-line no-param-reassign */
      report.success = success;
    }
  }
};

export const getLastReport = async (
  eventName: string,
  pluginOptions: PluginOptions,
  config: Config,
  report: Report,
  EventEmitter: Emitter,
): Promise<void> => {
  const [, command] = eventName.split('/');
  const getEvent: GetEvent = {
    command,
  };

  const {
    rets: [row],
  } = await EventEmitter.fire('plugin/last-value/report/get', getEvent);

  if (row) {
    const archived = typeof row.report === 'string' ? JSON.parse(row.report) : row.report;

    row.report = archived;

    if (archived.data) {
      const queue = new Queue();

      archived.data.forEach((archiveItem: LastReportItem): void =>
        queue.add((): Promise<void> => applyRow(archiveItem, config, report, pluginOptions)),
      );

      await queue.run();
    }
  }
};

export const saveReport = async (
  eventName: string,
  config: Config,
  report: Report,
  EventEmitter: Emitter,
): Promise<void> => {
  if (!config.saveOnlyOnSuccess || report.success) {
    const [, command] = eventName.split('/');
    const saveEvent: SaveEvent = {
      command,
      report,
    };

    await EventEmitter.fire('plugin/last-value/report/save', saveEvent);
  }
};
