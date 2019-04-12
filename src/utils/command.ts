import program from 'commander';
/* eslint-disable @typescript-eslint/no-explicit-any */
import { CommandOptions } from '@/typings/utils/command';
import { resolvePath } from '@/utils/fs';

const defaultConfig: CommandOptions = {
  config: './gimbal.config.json',
  cwd: resolvePath(),
};

const getOptions = (cmd: any, existingOptions?: CommandOptions): CommandOptions => {
  const existing: CommandOptions = existingOptions || defaultConfig;
  const options: CommandOptions = {
    ...existing,
  };

  const cmdOptions = cmd.options;

  if (cmdOptions) {
    cmdOptions.forEach(
      (option: any): void => {
        const name = option.attributeName();
        const value = cmd[name];

        if (value != null) {
          options[name] = value;
        }
      },
    );
  }

  if (existingOptions) {
    options.cwd = resolvePath(options.cwd);

    // maybe load config here?
    options.config = resolvePath(options.cwd, options.config);
  }

  return options;
};

/* eslint-disable-next-line import/prefer-default-export */
export const getOptionsFromCommand = (cmd: any, defaults?: any): CommandOptions => {
  // get command options first
  const cmdOptions: CommandOptions = getOptions(cmd);
  // get the global options to always take precedent over command options
  // in case there are option conflicts
  const options: CommandOptions = getOptions(program, cmdOptions);

  if (defaults) {
    const parsed = typeof defaults === 'function' ? defaults(options) : defaults;

    return {
      ...parsed,
      ...options,
    };
  }

  return options;
};
