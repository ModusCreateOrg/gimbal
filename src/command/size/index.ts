import sizeModule from '@/module/size';
import { CommandReturn } from '@/typings/command';
import { CommandOptions } from '@/typings/utils/command';

const sizeCommand = async (options: CommandOptions): Promise<CommandReturn> => sizeModule(options.cwd as string);

export default sizeCommand;
