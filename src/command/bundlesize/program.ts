import program from 'commander';
import bundlesize from './index';
import cliOutput from '@/module/bundlesize/output/cli';
import output from '@/output';
import { getOptionsFromCommand } from '@/utils/command';
import log from '@/utils/logger';
import { ParsedBundleConfig } from '@/typings/module/bundlesize';

const BundleSizeRegister = (): void => {
  program.command('bundle-size').action(
    async (cmd): Promise<void> => {
      try {
        const commandOptions = getOptionsFromCommand(cmd);
        const reports: ParsedBundleConfig[] = await bundlesize(commandOptions);
        const hasFailure: boolean = reports.some(
          (parsedConfig: ParsedBundleConfig): boolean => parsedConfig.failures.length > 0,
        );

        cliOutput(reports);
        await output(reports, commandOptions);

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

export default BundleSizeRegister;
