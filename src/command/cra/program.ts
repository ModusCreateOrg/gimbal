import program from 'commander';
import cra from './index';
import Config from '@/config';
import output from '@/output';
import { CRAOptions } from '@/typings/command/cra';
import { CommandOptions } from '@/typings/utils/command';
import { getOptionsFromCommand } from '@/utils/command';
import { resolvePath } from '@/utils/fs';

const CRARegister = (): void => {
  program
    .command('cra')
    .option('--no-lighthouse', 'Disable the lighthouse auditing')
    .option('--no-bundle-size', 'Disable checking bundle sizes')
    .option('--no-calculate-unused-source', 'Disable calculating unused CSS and JavaScript')
    .option('--no-heap-snapshot', 'Disable getting a heap snapshot')
    .action(
      async (cmd): Promise<void> => {
        const commandOptions = getOptionsFromCommand(
          cmd,
          ({ cwd }: CommandOptions): CRAOptions => ({
            artifactDir: resolvePath(cwd, './artifacts'),
          }),
        );

        await Config.load(commandOptions.cwd);

        const report = await cra(commandOptions);

        await output(report, commandOptions);
      },
    );
};

export default CRARegister;
