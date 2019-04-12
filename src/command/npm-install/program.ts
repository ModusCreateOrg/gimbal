import program from 'commander';
import npmInstall from './index';
import { getOptionsFromCommand } from '@/utils/command';

const NpmInstallRegister = (): void => {
  program.command('npm-install [cmd...]').action(
    async (args: string[], cmd): Promise<void> => {
      await npmInstall(
        getOptionsFromCommand(cmd, {
          cwd: process.env,
        }),
        args,
      );
    },
  );
};

export default NpmInstallRegister;
