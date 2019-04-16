import program from 'commander';
import directorysize from './index';
import cliOutput from '@/module/directory-size/output/cli';
import { getOptionsFromCommand } from '@/utils/command';
import log from '@/utils/logger';
import { ParsedDirectoryConfig } from '@/typings/module/directory-size';

const DirectorySizeRegister = (): void => {
  program.command('directory-size').action(
    async (cmd): Promise<void> => {
      try {
        const commandOptions = getOptionsFromCommand(cmd);
        const report: ParsedDirectoryConfig = await directorysize(commandOptions);
        const hasFailure = report.failures.length;

        cliOutput(report, commandOptions);
        // await output(report, commandOptions);

        if (hasFailure) {
          process.exit(1);
        }
      } catch (error) {
        log(error);

        process.exit(1);
      }
    },
  );
};

export default DirectorySizeRegister;
