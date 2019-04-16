import program from 'commander';
import figlet from 'figlet';
import npmInstall from './index';
import output from '@/output';
import { getOptionsFromCommand } from '@/utils/command';
import log from '@/utils/logger';

const NpmInstallRegister = (): void => {
  program.command('npm-install [cmd...]').action(
    async (args: string[], cmd): Promise<void> => {
      const commandOptions = getOptionsFromCommand(cmd, {
        cwd: process.env,
      });

      log(figlet.textSync('Npm Install'));

      const report = await npmInstall(commandOptions, args);

      await output(report, commandOptions);
    },
  );
};

export default NpmInstallRegister;
