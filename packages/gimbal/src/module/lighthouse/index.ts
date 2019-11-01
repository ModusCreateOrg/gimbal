import deepmerge from 'deepmerge';
// @ts-ignore
import lighthouse from 'lighthouse';
import Config from '@/config';
import EventEmitter from '@/event';
import { Report } from '@/typings/command';
import { Context } from '@/typings/context';
import {
  Audit,
  Config as LighthouseConfig,
  Options,
  AuditStartEvent,
  AuditEndEvent,
  ReportStartEvent,
  ReportEndEvent,
} from '@/typings/module/lighthouse';
import defaultConfig from './default-config';
import parseReport from './output';

// Default config options
const defaults = {
  output: ['json'],
};

const lighthouseRunner = async (
  url: string,
  userOptions: Options,
  context: Context,
  configArg: LighthouseConfig = Config.get('configs.lighthouse', {}),
): Promise<Report> => {
  const config = deepmerge(configArg, defaultConfig);
  // Build options but let users change the defaults if needed
  const options = {
    ...deepmerge(defaults, userOptions),
    ...Config.getObject(
      [
        {
          config: 'configs.lighthouse',
          defaultValue: {
            maxWaitForFcp: 60 * 1000,
          },
          key: 'lighthouseConfig', // is just a temp key since flatten is true
        },
      ],
      {
        flatten: true,
        removeProps: ['outputHtml', 'threshold'],
      },
    ),
  };

  const lighthouseOutputHtml = context.config.get('configs.lighthouseOutputHtml');

  if ((config.outputHtml || lighthouseOutputHtml) && options.output.indexOf('html') === -1) {
    options.output.push('html');

    if (!config.outputHtml) {
      /* eslint-disable-next-line no-param-reassign  */
      config.outputHtml = lighthouseOutputHtml as string;
    }
  }

  const auditStartEvent: AuditStartEvent = {
    config,
    context,
    options,
    url,
  };

  await EventEmitter.fire(`module/lighthouse/audit/start`, auditStartEvent);

  const audit: Audit = await lighthouse(
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
    context,
    options,
    url,
  };

  await EventEmitter.fire(`module/lighthouse/audit/end`, auditEndEvent);

  const reportStartEvent: ReportStartEvent = {
    audit,
    config,
    context,
    options,
    url,
  };

  await EventEmitter.fire(`module/lighthouse/report/start`, reportStartEvent);

  const report = await parseReport(audit, config, context);

  const reportEndEvent: ReportEndEvent = {
    audit,
    config,
    context,
    options,
    report,
    url,
  };

  await EventEmitter.fire(`module/lighthouse/report/end`, reportEndEvent);

  return report;
};

export default lighthouseRunner;
