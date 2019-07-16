import env from '@modus/gimbal-core/lib/utils/env';
import { readFile } from '@modus/gimbal-core/lib/utils/fs';
import yaml from 'js-yaml';
import { Config } from '@/typings/config';

const VAR_RE = /\${(.+?):(.+?)(?:,\s*(.+?))?(?:,\s*(.+?))?}/gm;

/* eslint-disable-next-line @typescript-eslint/no-explicit-any */
const parseValue = (value: any): any => {
  if (value === 'true') {
    return true;
  }

  if (value === 'false') {
    return false;
  }

  return value;
};

const yamlLoader = async (file: string): Promise<Config> => {
  const source = await readFile(file, 'utf8');
  // this will allow for variable replacement. The following are the supported types and formats:
  // - ${env:SOME_VAR}
  //    The type is "env" which will lookup "SOME_VAR" on process.env. If the var is not found
  //    then the text will not be replaced.
  // If the type is unrecognized, the text will not be replaced.
  const doc = source.replace(
    VAR_RE,
    (text: string, type: string, prop: string, trueValue?: string, falseValue?: string): string => {
      if (type === 'env') {
        const ret = env(prop);

        if (ret) {
          if (trueValue) {
            return parseValue(trueValue);
          }
        } else if (falseValue) {
          return parseValue(falseValue);
        }

        return ret === undefined ? text : ret;
      }

      return text;
    },
  );

  return yaml.safeLoad(doc, {
    filename: file,
    json: true,
  });
};

export default yamlLoader;
