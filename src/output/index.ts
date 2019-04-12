import { CommandOptions } from '@/typings/utils/command';
import log from '@/utils/logger';

/* eslint-disable-next-line @typescript-eslint/no-explicit-any */
const output = (data: any, commandOptions: CommandOptions): void => {
  if (commandOptions.output) {
    log(JSON.stringify(commandOptions, null, 2));
    log(JSON.stringify(data, null, 2));
  }
};

export default output;
