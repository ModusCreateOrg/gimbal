import bytes from 'bytes';
import program from 'commander';
import figlet from 'figlet';
import bundlesize from './index';
import output from '@/output';
import { getOptionsFromCommand } from '@/utils/command';
import log from '@/utils/logger';
import { ParsedBundleConfig, ParsedFile } from '@/typings/module/bundlesize';

const formatFile = (file: ParsedFile, maxSizeBytes: number): string => {
  const diff = file.size - maxSizeBytes;
  const diffBytes = bytes(Math.abs(diff), { unitSeparator: ' ' });
  const percentage = Math.abs((diff / maxSizeBytes) * 100);
  const prefix = diff > 0 ? '+' : '-';
  const difference = `${prefix}${diffBytes} (${prefix}${percentage.toFixed(2)} %)`;

  return `${file.path}
     Size: ${bytes(file.size, { unitSeparator: ' ' })}  │  Difference: ${difference}`;
};

const formatConfig = (config: ParsedBundleConfig, failures: boolean): string => {
  const files = failures ? config.failures : config.successes;
  const label = failures ? `failure${files.length === 1 ? '' : 's'}` : `success${files.length === 1 ? '' : 'es'}`;

  return `"${config.path}" has ${files.length} ${label}:
   Max Size: ${bytes(config.maxSizeBytes, { unitSeparator: ' ' })}
   ${files.map((file: ParsedFile): string => formatFile(file, config.maxSizeBytes)).join('\n')}`;
};

const BundleSizeRegister = (): void => {
  program.command('bundle-size').action(
    async (cmd): Promise<void> => {
      try {
        const commandOptions = getOptionsFromCommand(cmd);
        const ret: ParsedBundleConfig[] = await bundlesize(commandOptions);
        const failedRets: ParsedBundleConfig[] = ret.filter(
          (parsedConfig: ParsedBundleConfig): boolean => parsedConfig.failures.length > 0,
        );
        const successRets: ParsedBundleConfig[] = ret.filter(
          (parsedConfig: ParsedBundleConfig): boolean => parsedConfig.successes.length > 0,
        );

        await output(ret, commandOptions);

        if (ret.length) {
          const messages: string[] = [figlet.textSync('Bundle Size Check'), ` ${new Array(80).fill('─').join('')}`, ''];

          if (failedRets.length) {
            const message = failedRets
              .map((parsedConfig: ParsedBundleConfig): string => formatConfig(parsedConfig, true))
              .join('\n');

            messages.push('FAILURES:', message, '');
          }

          const message = successRets
            .map((parsedConfig: ParsedBundleConfig): string => formatConfig(parsedConfig, false))
            .join('\n');

          messages.push('SUCCESSES:', message);

          log(messages.join('\n'));
        }

        if (failedRets.length) {
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
