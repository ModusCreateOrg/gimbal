import yaml from 'js-yaml';
import { readFile } from '@modus/gimbal-core/lib/utils/fs';
import { Config } from '@/typings/config';

const yamlLoader = async (file: string): Promise<Config> => {
  const doc = await readFile(file, 'utf8');

  return yaml.safeLoad(doc, {
    filename: file,
    json: true,
  });
};

export default yamlLoader;
