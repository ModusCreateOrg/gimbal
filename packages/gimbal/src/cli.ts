import logger, { setLevel } from '@modus/gimbal-core/lib/logger';
import path from 'path';
import readPkg from 'read-pkg';
import updateNotifier from 'update-notifier';

import Cli from './utils/Cli';
import gimbal from './index';

Cli.add({
  'build-dir': {
    type: 'string',
  },
  'calculate-unused-source': {
    default: true,
    type: 'boolean',
  },
  'check-thresholds': {
    default: true,
    type: 'boolean',
  },
  comment: {
    default: true,
    type: 'boolean',
  },
  config: {
    type: 'string',
  },
  cwd: {
    default: process.cwd(),
    type: 'string',
  },
  'heap-snapshot': {
    default: true,
    type: 'boolean',
  },
  help: {
    type: 'boolean',
  },
  lighthouse: {
    default: true,
    type: 'boolean',
  },
  'lighthouse-output-html': {
    type: 'string',
  },
  'output-html': {
    type: 'string',
  },
  'output-json': {
    type: 'string',
  },
  'output-markdown': {
    type: 'string',
  },
  route: {
    default: ['/'],
    type: 'array',
  },
  size: {
    default: true,
    type: 'boolean',
  },
  verbose: {
    type: 'boolean',
  },
  version: {
    type: 'boolean',
  },
});

(async (): Promise<void> => {
  const { args } = Cli;

  if (args.verbose) {
    setLevel('verbose');
  }

  const isBuilt = path.extname(__filename) === '.js';
  const packageJson = await readPkg({
    cwd: isBuilt ? path.join(__dirname, '../../..') : path.join(__dirname, '..'),
  });

  if (args.help) {
    logger.log('output help screen');
  } else if (args.version) {
    logger.log(packageJson.version);
  } else {
    updateNotifier({ pkg: packageJson }).notify();

    try {
      await gimbal();

      logger.log('Finished successfully');

      process.exit(0);
    } catch (e) {
      logger.log(e);

      logger.log('Finished with failure');

      process.exit(1);
    }
  }
})();
