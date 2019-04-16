import bytes from 'bytes';
import { log } from 'console';
import Config from '@/config';
import { getDirectorySize } from '@/utils/fs';
import { ParsedDirectoryConfig, DirectoryCheck, DirectoryConfig } from '@/typings/module/directory-size';

const defaultConfig: DirectoryConfig = {
  maxSize: '500 KB',
};

const directorysizeModule = async (
  cwd: string,
  directoryConfig: DirectoryConfig = Config.get('configs.directory-size', defaultConfig),
): Promise<ParsedDirectoryConfig> => {
  const failures: DirectoryCheck[] = [];
  const successes: DirectoryCheck[] = [];

  if (!directoryConfig) {
    return Promise.resolve({ failures, successes });
  }

  try {
    const size = (await getDirectorySize(cwd)) as number;
    const directoryCheck: DirectoryCheck = {
      ...directoryConfig,
      path: cwd,
      size,
    };

    if (size > bytes(directoryCheck.maxSize)) {
      failures.push(directoryCheck);
    } else {
      successes.push(directoryCheck);
    }
  } catch {
    log(`[directory-size] The directory passed does not exist: ${cwd}`);
    process.exit(1);
  }

  return {
    failures,
    successes,
  };
};

export default directorysizeModule;
