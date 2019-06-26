import { doesItemFail, getItemDiff } from './util';
import { Report, ReportItem } from '@/typings/command';
import { Config, LastReportItem, GetEvent, SaveEvent } from '@/typings/plugin/last-value';
import { Metas } from '@/typings/plugin/last-value/util';

const applyRow = (archiveItem: LastReportItem, config: Config, report: Report, metaMap: Metas): void => {
  const { failOnBreach } = config;
  const parent = report.data && report.data.find((item: ReportItem): boolean => item.type === archiveItem.type);

  if (parent && parent.data && archiveItem.data) {
    let { success } = parent;

    parent.data.forEach((item: ReportItem): void => {
      const match =
        archiveItem.data &&
        archiveItem.data.find((archiveChild: ReportItem): boolean => archiveChild.rawLabel === item.rawLabel);

      if (match) {
        /* eslint-disable-next-line no-param-reassign */
        item.lastValue = match.value;
        /* eslint-disable-next-line no-param-reassign */
        item.rawLastValue = match.rawValue;

        const diffInfo = getItemDiff(item as LastReportItem, metaMap);

        if (diffInfo) {
          /* eslint-disable-next-line no-param-reassign */
          (item as LastReportItem).lastValueChange = diffInfo.change;
          /* eslint-disable-next-line no-param-reassign */
          (item as LastReportItem).lastValueDiff = diffInfo.diff;
        }

        if (failOnBreach && item.success) {
          const itemSuccess = !doesItemFail(item as LastReportItem, config, metaMap);

          /* eslint-disable-next-line no-param-reassign */
          item.success = itemSuccess;

          if (success) {
            success = itemSuccess;
          }
        }
      }
    });

    if (failOnBreach) {
      parent.success = success;
      /* eslint-disable-next-line no-param-reassign */
      report.success = success;
    }
  }
};

export const getLastReport = async (
  eventName: string,
  config: Config,
  report: Report,
  /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
  Emitter: any,
  metaMap: Metas,
): Promise<void> => {
  const [, command] = eventName.split('/');
  const getEvent: GetEvent = {
    command,
  };

  const {
    rets: [row],
  } = await Emitter.fire('plugin/last-value/report/get', getEvent);

  if (row) {
    const archived = typeof row.report === 'string' ? JSON.parse(row.report) : row.report;

    row.report = archived;

    if (archived.data) {
      archived.data.forEach((archiveItem: LastReportItem): void => {
        applyRow(archiveItem, config, report, metaMap);
      });
    }
  }
};

/* eslint-disable-next-line @typescript-eslint/no-explicit-any */
export const saveReport = async (eventName: string, config: Config, report: Report, Emitter: any): Promise<void> => {
  if (!config.saveOnlyOnSuccess || report.success) {
    const [, command] = eventName.split('/');
    const saveEvent: SaveEvent = {
      command,
      report,
    };

    await Emitter.fire('plugin/last-value/report/save', saveEvent);
  }
};
