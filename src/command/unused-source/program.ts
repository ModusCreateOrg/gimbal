import program from 'commander';
import figlet from 'figlet';
import unusedSource from './index';
import cliOutput from '@/module/unused-source/output/cli';
import output from '@/output';
import { getOptionsFromCommand } from '@/utils/command';
import log from '@/utils/logger';

const UnusedSourceRegister = (): void => {
  program.command('unused-source').action(
    async (cmd): Promise<void> => {
      try {
        const commandOptions = getOptionsFromCommand(cmd);
        const reports = await unusedSource(commandOptions);

        log(figlet.textSync('Unused Source Checks'));

        if (reports) {
          cliOutput(reports, commandOptions);
        }

        await output(reports, commandOptions);
      } catch (error) {
        log(error);

        process.exit(1);
      }
    },
  );
};

export default UnusedSourceRegister;
