import fs from 'fs';
import path from 'path';
import { ParsedArgs } from 'minimist';

import { StartEvent, EndEvent, ActionStartEvent, ActionEndEvent, Report } from '@/typings/command';

import audit from './command/audit';
import reconcileReports from './command/reconcile';
import Config from './config';
import Context from './context';
import EventEmitter from './event';
import output from './output';
import { CHILD_GIMBAL_PROCESS } from './utils/constants';
import comment from './vcs/comment';

const gimbal = async (args?: ParsedArgs): Promise<void> => {
  if (!process.env[CHILD_GIMBAL_PROCESS]) {
    const gimbalArt = fs.readFileSync(path.join(__dirname, 'ascii_art/gimbal.txt'), 'utf8');

    /* eslint-disable-next-line no-console */
    console.log(gimbalArt);
  }

  const context = new Context();

  await Config.load(context);

  if (args) {
    Config.mergeArgs(args);
  }

  const startEvent: StartEvent = {
    command: 'audit',
    context,
  };

  await EventEmitter.fire(`command/audit/start`, startEvent);

  const actionStartEvent: ActionStartEvent = {
    command: 'audit',
    context,
  };

  await EventEmitter.fire(`command/audit/action/start`, actionStartEvent);

  const reports: Report | Report[] = await audit(context);
  const report: Report = reconcileReports(reports);

  const actionEndEvent: ActionEndEvent = {
    command: 'audit',
    context,
    report,
  };

  await EventEmitter.fire(`command/audit/action/end`, actionEndEvent);

  await output(report, context);
  await comment(report, context);

  const endEvent: EndEvent = {
    command: 'audit',
    context,
    report,
  };

  await EventEmitter.fire(`command/audit/end`, endEvent);

  if (!report.success) {
    throw new Error('Finished with failure');
  }
};

export default gimbal;
