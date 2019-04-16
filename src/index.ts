#!/usr/bin/env node

import program from 'commander';
import fs from 'fs';
import path from 'path';
import CRARegister from '@/command/cra/program';
import BundleSizeRegister from '@/command/bundle-size/program';
import HeapSnapshotRegister from '@/command/heap-snapshot/program';
import LighthouseRegister from '@/command/lighthouse/program';
import NpmInstallRegister from '@/command/npm-install/program';
import UnusedSourceRegister from '@/command/unused-source/program';
import Config from '@/config';
import { getOptionsFromCommand } from '@/utils/command';
import log from '@/utils/logger';
import DirectorySizeRegister from './command/directory-size/program';

const gimbal = fs.readFileSync(path.join(__dirname, 'ascii_art/gimbal.txt'), 'utf8');

log(gimbal);

program
  .version('0.0.1')
  .description('A CLI tool for monitoring web performance in modern web projects')
  // global options all command will receive
  .option('--cwd [dir]', 'The directory to work in. Defaults to where the command was executed from.')
  .option('--output-html [file]', 'The path to write the results as HTML to.')
  .option('--output-json [file]', 'The path to write the results as JSON to.')
  .option('--output-markdown [file]', 'The path to write the results as Markdown to.')
  .option('--verbose', 'Turn on extra logging during command executions.');

// register commands with commander
CRARegister();
BundleSizeRegister();
HeapSnapshotRegister();
LighthouseRegister();
NpmInstallRegister();
DirectorySizeRegister();
UnusedSourceRegister();

// kick off commander
program.parse(process.argv);

if (!program.args.length) {
  // if no args (aka commands) were passed
  // let's load the config file to see if
  // there are any jobs configured
  (async (): Promise<void> => {
    const options = getOptionsFromCommand();

    const config = await Config.load(options.cwd);

    if (config) {
      const { jobs } = config;

      if (jobs) {
        // TODO
        log(JSON.stringify(jobs, null, 2));
      } else {
        // no jobs so there is nothing to execute
        // so let's show the help screen
        program.help();
      }
    }
  })();
}
