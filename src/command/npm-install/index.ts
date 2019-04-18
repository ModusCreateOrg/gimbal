import NpmInstall from '@/module/npm-install';
import { CommandReturn } from '@/typings/command';
import { CommandOptions } from '@/typings/utils/command';

const npmInstall = async (options: CommandOptions, args?: string[]): Promise<CommandReturn> => {
  try {
    const data = await NpmInstall(options, args);

    return {
      data,
      success: true,
    };
  } catch (error) {
    return {
      error,
      success: false,
    };
  }
};

export default npmInstall;
