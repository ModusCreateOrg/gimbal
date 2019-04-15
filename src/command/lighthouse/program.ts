import program from 'commander';
import lighthouse from './index';
import cliOutput from '@/module/lighthouse/output/cli';
import { getOptionsFromCommand } from '@/utils/command';
import { resolvePath } from '@/utils/fs';
import { LighthouseOptions } from '@/typings/command/lighthouse';
import { CommandOptions } from '@/typings/utils/command';

const LighthouseRegister = (): void => {
  program
    .command('lighthouse')
    .option(
      '-a, --artifact-dir [dir]',
      'Path to the artifact directory (defaults to `../artifacts` relative to the cwd directory)',
    )
    .action(
      async (cmd): Promise<void> => {
        const commandOptions: CommandOptions = getOptionsFromCommand(
          cmd,
          ({ artifactDir, cwd }: LighthouseOptions & CommandOptions): LighthouseOptions => ({
            artifactDir: artifactDir ? resolvePath(artifactDir) : resolvePath(cwd, '../artifacts'),
          }),
        );
        const report = await lighthouse(commandOptions);

        if (report) {
          cliOutput(report, commandOptions);
        }
      },
    );
};

export default LighthouseRegister;
