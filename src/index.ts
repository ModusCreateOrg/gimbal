#!/usr/bin/env node

import chalk from 'chalk';
import figlet from 'figlet';
import program from 'commander';
import cra from '@/command/cra';
import lighthouse from '@/command/lighthouse';
import npmInstall from '@/command/npm-install';
import { getOptionsFromCommand } from '@/utils/command';
import { resolvePath } from '@/utils/fs';

import { CRAOptions } from '@/typings/command/cra';
import { LightHouseOptions } from '@/typings/command/lighthouse';

// eslint-disable-next-line no-console
console.log(chalk.white(figlet.textSync('Gimbal - Modus Create')));

program.version('0.0.1').description('A CLI tool for monitoring web performance in modern web projects');

program
  .command('cra')
  .option('--cwd [dir', 'Path of the CRA')
  .option('--no-lighthouse', 'Disable the lighthouse auditing')
  .option('--no-npm-install', 'Disable the `npm install` command')
  .option('--no-calculate-unused-css', 'Disable calculating unused CSS')
  .option('--no-heap-snapshot', 'Disable getting a heap snapshot')
  .option('--npm-install-command [cmd]', 'The command to use to install, defaults to `npm install`')
  .action(
    async (cmd): Promise<void> => {
      await cra(
        getOptionsFromCommand(
          cmd,
          ({ cwd }: CRAOptions): CRAOptions => ({
            artifactDir: resolvePath(cwd, '../artifacts'),
            cwd,
            npmInstallCommand: ['npm', 'install'],
          }),
        ),
      );
    },
  );

program
  .command('lighthouse')
  .option(
    '-a, --artifact-dir [dir]',
    'Path to the artifact directory (defaults to `../artifacts` relative to the cwd directory)',
  )
  .option('--cwd [dir]', 'The directory to host to run lighthouse against (defaults to the curred working directory)')
  .action(
    async (cmd): Promise<void> => {
      await lighthouse(
        getOptionsFromCommand(
          cmd,
          ({ cwd }: LightHouseOptions): LightHouseOptions => ({
            artifactDir: resolvePath(cwd, '../artifacts'),
            cwd,
          }),
        ),
      );
    },
  );

program
  .command('npm-install [cmd...]')
  .option('--cwd [dir]', 'Path to run the install in, defaults to current working directory')
  .action(
    async (args: string[], cmd): Promise<void> => {
      await npmInstall(
        getOptionsFromCommand(cmd, {
          cwd: process.env,
        }),
        args,
      );
    },
  );

program.parse(process.argv);

if (!program.args.length) {
  program.help();

  process.exit(0);
}
