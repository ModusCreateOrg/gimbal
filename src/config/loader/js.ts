import { Config } from '@/typings/config';

const jsLoader = async (file: string): Promise<Config> => {
  const config = await import(file);

  if (typeof config === 'function') {
    return config();
  }

  return config;
};

export default jsLoader;
