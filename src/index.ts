#!/usr/bin/env node

import program from 'commander';
import fs from 'fs';
import path from 'path';
import CRARegister from '@/command/cra/program';
import BundleSizeRegister from '@/command/bundlesize/program';
import LighthouseRegister from '@/command/lighthouse/program';
import NpmInstallRegister from '@/command/npm-install/program';
import log from '@/utils/logger';

const gimbal = fs.readFileSync(path.join(__dirname, 'ascii_art/gimbal.txt'), 'utf8');

log(gimbal);

program
  .version('0.0.1')
  .description('A CLI tool for monitoring web performance in modern web projects')
  // global options all command will receive
  .option('-c, --config [dir]', 'Path to the configuration file.')
  .option('--cwd [dir]', 'The directory to work in. Defaults to where the command was executed from.')
  .option(
    '-o, --output [file]',
    'The type of output or path to output results (in which case the type of output is determined by file extension). Valid outputs are: html, json, markdown',
  );

// register commands with commander
CRARegister();
BundleSizeRegister();
LighthouseRegister();
NpmInstallRegister();

// kick off commander
program.parse(process.argv);

if (!program.args.length) {
  // if no args, present help screen automatically
  program.help();
}
