import yaml from 'js-yaml';
import { Config } from '@/typings/config';
import { readFile } from '@/shared/utils/fs';

const yamlLoader = async (file: string): Promise<Config> => {
  const doc = await readFile(file, 'utf8');

  return yaml.safeLoad(doc, {
    filename: file,
    json: true,
  });
};

export default yamlLoader;
