import { RawConfig } from '@/typings/config';

const jsLoader = async (file: string): Promise<RawConfig> => {
  const config = await import(file);

  if (typeof config === 'function') {
    return config();
  }

  return config;
};

export default jsLoader;
