import sizeModule from '@/module/size';
import { ParsedSizeConfig } from '@/typings/module/size';
import { CommandOptions } from '@/typings/utils/command';

const sizeCommand = (options: CommandOptions): Promise<ParsedSizeConfig[]> => sizeModule(options.cwd as string);

export default sizeCommand;
