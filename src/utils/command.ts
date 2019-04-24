/* eslint-disable @typescript-eslint/no-explicit-any */

import program from 'commander';
import { existsSync } from 'fs';
import { CommandOptions } from '@/typings/utils/command';
import { resolvePath } from '@/utils/fs';

const defaultConfig: CommandOptions = {
  cwd: resolvePath(),
  verbose: false,
};

const getOptions = (cmd?: any, existingOptions?: CommandOptions): CommandOptions => {
  const existing: CommandOptions = existingOptions || defaultConfig;
  const options: CommandOptions = {
    ...existing,
  };

  if (cmd) {
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
  }

  if (existingOptions) {
    options.cwd = resolvePath(options.cwd);

    if (!existsSync(options.cwd)) {
      throw new Error(`--cwd not found: ${options.cwd}`);
    }

    if (options.outputHtml) {
      options.outputHtml = resolvePath(options.cwd, options.outputHtml);
    }

    if (options.outputJson) {
      options.outputJson = resolvePath(options.cwd, options.outputJson);
    }

    if (options.outputMarkdown) {
      options.outputMarkdown = resolvePath(options.cwd, options.outputMarkdown);
    }
  }

  return options;
};

/* eslint-disable-next-line import/prefer-default-export */
export const getOptionsFromCommand = (cmd?: any, defaults?: any): CommandOptions => {
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
