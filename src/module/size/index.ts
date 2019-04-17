// @ts-ignore
import brotliSize from 'brotli-size';
import bytes from 'bytes';
import globby from 'globby';
import gzipSize from 'gzip-size';
import Config from '@/config';
import { SizeConfig, SizeConfigs, ParsedSizeConfig, ParsedFile } from '@/typings/module/size';
import { readFile, resolvePath, stats, getDirectorySize } from '@/utils/fs';

type CompressionMechanisms = 'brotli' | 'gzip' | undefined;

export const defaultConfig: SizeConfig = {
  configs: [
    {
      path: './build/precache-*.js',
      maxSize: '50 KB',
    },
    {
      path: './build/static/js/*.chunk.js',
      maxSize: '200 KB',
    },
    {
      path: './build/static/js/runtime*.js',
      maxSize: '30 KB',
    },
    {
      path: './build/',
      maxSize: '500 KB',
    },
  ],
};

const getBundleSize = (source: Buffer, compression?: CompressionMechanisms): number => {
  switch (compression) {
    case 'brotli':
      return brotliSize.sync(source);
    case 'gzip':
      return gzipSize.sync(source);
    default:
      return Buffer.byteLength(source);
  }
};

const getFileSource = (path: string): Promise<Buffer> => readFile(path);

const getFileSize = async (path: string, compression: CompressionMechanisms): Promise<number> => {
  const source = await getFileSource(path);

  return getBundleSize(source, compression);
};

const getDirSize = async (path: string): Promise<number> => (await getDirectorySize(path)) as number;

const getFileResult = async (cwd: string, sizeConfig: SizeConfig, config: SizeConfigs): Promise<ParsedSizeConfig> => {
  const fullPath = resolvePath(cwd, config.path);
  const paths = await globby(fullPath, { expandDirectories: false, onlyFiles: false });

  if (!paths.length) {
    throw new Error('No files found for the size check');
  }

  const maxSizeBytes = bytes(config.maxSize);

  const failures: ParsedFile[] = [];
  const successes: ParsedFile[] = [];

  await Promise.all(
    paths.map(
      async (path: string): Promise<ParsedFile> => {
        const pathStats = await stats(path);
        const size: number = pathStats.isDirectory()
          ? await getDirSize(path)
          : await getFileSize(path, sizeConfig.compression);
        const fail = size > maxSizeBytes;
        const parsedFile: ParsedFile = { fail, path, size };

        if (fail) {
          failures.push(parsedFile);
        } else {
          successes.push(parsedFile);
        }

        return parsedFile;
      },
    ),
  );

  return {
    ...config,
    failures,
    fullPath,
    maxSizeBytes,
    successes,
  };
};

const sizeModule = async (
  cwd: string,
  sizeConfig: SizeConfig | SizeConfigs[] = Config.get('configs.size', defaultConfig),
): Promise<ParsedSizeConfig[]> => {
  if (!sizeConfig) {
    return Promise.resolve([]);
  }

  const configObject: SizeConfig = Array.isArray(sizeConfig) ? { configs: sizeConfig } : sizeConfig;

  return Promise.all(
    configObject.configs.map(
      (config: SizeConfigs): Promise<ParsedSizeConfig> => getFileResult(cwd, configObject, config),
    ),
  );
};

export default sizeModule;
