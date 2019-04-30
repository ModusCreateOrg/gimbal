import NpmInstall from '@/module/npm-install';
import { Report } from '@/typings/command';
import { CommandOptions } from '@/typings/utils/command';

const npmInstall = async (options: CommandOptions, args?: string[]): Promise<Report> => {
  try {
    const data = await NpmInstall(options, args);

    return {
      data: [
        {
          label: 'NPM Install',
          rawLabel: 'NPM Install',
          rawThreshold: 0,
          rawValue: data.code,
          success: true,
          threshold: 0,
          thresholdLimit: 'upper',
          value: data.code,
        },
      ],
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
