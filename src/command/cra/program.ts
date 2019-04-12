import program from 'commander';
import cra from './index';
import { getOptionsFromCommand } from '@/utils/command';
import { resolvePath } from '@/utils/fs';
import { CRAOptions } from '@/typings/command/cra';
import { CommandOptions } from '@/typings/utils/command';

const CRARegister = (): void => {
  program
    .command('cra')
    .option('--no-lighthouse', 'Disable the lighthouse auditing')
    .option('--no-npm-install', 'Disable the `npm install` command')
    .option('--no-bundle-size', 'Disable checking bundle sizes')
    .option('--no-calculate-unused-css', 'Disable calculating unused CSS')
    .option('--no-heap-snapshot', 'Disable getting a heap snapshot')
    .option('--npm-install-command [cmd]', 'The command to use to install, defaults to `npm install`')
    .action(
      async (cmd): Promise<void> => {
        await cra(
          getOptionsFromCommand(
            cmd,
            ({ cwd }: CommandOptions): CRAOptions => ({
              artifactDir: resolvePath(cwd, './artifacts'),
              npmInstallCommand: ['npm', 'install'],
            }),
          ),
        );
      },
    );
};

export default CRARegister;
