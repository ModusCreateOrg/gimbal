import fs from 'fs';
import path from 'path';
import { ParsedArgs } from 'minimist';

import { StartEvent, EndEvent, ActionStartEvent, ActionEndEvent, Report } from '@/typings/command';

import audit from './command/audit';
import reconcileReports from './command/reconcile';
import Config from './config';
import EventEmitter from './event';
import output from './output';
import { CHILD_GIMBAL_PROCESS } from './utils/constants';
import comment from './vcs/comment';

const gimbal = async (args: ParsedArgs): Promise<void> => {
  if (!process.env[CHILD_GIMBAL_PROCESS]) {
    const gimbalArt = fs.readFileSync(path.join(__dirname, 'ascii_art/gimbal.txt'), 'utf8');

    /* eslint-disable-next-line no-console */
    console.log(gimbalArt);
  }

  await Config.load(args.cwd, args);

  const startEvent: StartEvent = {
    args,
    command: 'audit',
  };

  await EventEmitter.fire(`command/audit/start`, startEvent);

  const actionStartEvent: ActionStartEvent = {
    args,
    command: 'audit',
  };

  await EventEmitter.fire(`command/audit/action/start`, actionStartEvent);

  const reports: Report | Report[] = await audit(args);
  const report: Report = reconcileReports(reports);

  const actionEndEvent: ActionEndEvent = {
    args,
    command: 'audit',
    report,
  };

  await EventEmitter.fire(`command/audit/action/end`, actionEndEvent);

  await output(report, args);
  await comment(report, args);

  const endEvent: EndEvent = {
    args,
    command: 'audit',
    report,
  };

  await EventEmitter.fire(`command/audit/end`, endEvent);
};

export default gimbal;
