// @ts-ignore
import lighthouse from 'lighthouse';
import Config from '@/config';
import EventEmitter from '@/event';
import { Report } from '@/typings/command';
import {
  Config as LighthouseConfig,
  Options,
  AuditStartEvent,
  AuditEndEvent,
  ReportStartEvent,
  ReportEndEvent,
} from '@/typings/module/lighthouse';
import { CommandOptions } from '@/typings/utils/command';
import defaultConfig from './default-config';
import parseReport from './output';

const lighthouseRunner = async (
  url: string,
  options: Options,
  commandOptions: CommandOptions,
  config: LighthouseConfig = Config.get('configs.lighthouse', defaultConfig),
): Promise<Report> => {
  const auditStartEvent: AuditStartEvent = {
    config,
    options,
    url,
  };

  await EventEmitter.fire(`module/lighthouse/audit/start`, auditStartEvent);

  const audit = await lighthouse(
    url,
    {
      ...options,
      port: options.chromePort,
    },
    config,
  );

  const auditEndEvent: AuditEndEvent = {
    audit,
    config,
    options,
    url,
  };

  await EventEmitter.fire(`module/lighthouse/audit/end`, auditEndEvent);

  const reportStartEvent: ReportStartEvent = {
    audit,
    config,
    options,
    url,
  };

  await EventEmitter.fire(`module/lighthouse/report/start`, reportStartEvent);

  const report = parseReport(audit.lhr, config, commandOptions);

  const reportEndEvent: ReportEndEvent = {
    audit,
    config,
    options,
    report,
    url,
  };

  await EventEmitter.fire(`module/lighthouse/report/end`, reportEndEvent);

  return report;
};

export default lighthouseRunner;
