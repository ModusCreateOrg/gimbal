import program from 'commander';
import figlet from 'figlet';
import lighthouse from './index';
import Config from '@/config';
import cliOutput from '@/module/lighthouse/output/cli';
import output from '@/output';
import { LighthouseOptions } from '@/typings/command/lighthouse';
import { CommandOptions } from '@/typings/utils/command';
import { getOptionsFromCommand } from '@/utils/command';
import { resolvePath } from '@/utils/fs';
import log from '@/utils/logger';

const LighthouseRegister = (): void => {
  program
    .command('lighthouse')
    .option(
      '-a, --artifact-dir [dir]',
      'Path to the artifact directory (defaults to `../artifacts` relative to the cwd directory)',
    )
    .action(
      async (cmd): Promise<void> => {
        const commandOptions: LighthouseOptions & CommandOptions = getOptionsFromCommand(
          cmd,
          ({ artifactDir, cwd }: LighthouseOptions & CommandOptions): LighthouseOptions => ({
            artifactDir: artifactDir ? resolvePath(artifactDir) : resolvePath(cwd, '../artifacts'),
          }),
        );

        await Config.load(commandOptions.cwd);

        const report = await lighthouse(commandOptions);

        if (report) {
          log(figlet.textSync('Bundle Size Checks'));

          cliOutput(report);

          await output(report, commandOptions);

          if (commandOptions.artifactDir) {
            log(`Artifacts written to: ${resolvePath(commandOptions.artifactDir)}`);
          }
        }
      },
    );
};

export default LighthouseRegister;
