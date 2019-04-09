/* eslint-disable @typescript-eslint/no-explicit-any */
import { CommandOptions } from '@/typings/utils/command';
import { resolvePath } from '@/utils/fs';

/* eslint-disable-next-line import/prefer-default-export */
export const getOptionsFromCommand = (cmd: any, defaults?: any): CommandOptions => {
  const options: CommandOptions = {};
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

  if (options.cwd) {
    options.cwd = resolvePath(options.cwd as string);
  }

  if (defaults) {
    const parsed = typeof defaults === 'function' ? defaults(options) : defaults;

    return {
      ...parsed,
      ...options,
    };
  }

  return options;
};
