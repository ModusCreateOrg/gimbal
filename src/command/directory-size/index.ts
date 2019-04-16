import directorysizeModule from '@/module/directory-size';
import { CommandOptions } from '@/typings/utils/command';
import { ParsedDirectoryConfig } from '@/typings/module/directory-size';

const directorysizeCommand = async (options: CommandOptions): Promise<ParsedDirectoryConfig> =>
  directorysizeModule(options.cwd as string);
export default directorysizeCommand;
