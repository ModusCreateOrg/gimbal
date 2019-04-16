// @ts-ignore
import brotliSize from 'brotli-size';
import bytes from 'bytes';
import globby from 'globby';
import gzipSize from 'gzip-size';
import Config from '@/config';
import { BundleConfig, BundleConfigs, ParsedBundleConfig, ParsedFile } from '@/typings/module/bundle-size';
import { readFile, resolvePath } from '@/utils/fs';

export const defaultConfig: BundleConfig = {
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
  ],
};

const getBundleSize = (source: Buffer, compression?: 'brotli' | 'gzip'): number => {
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

const getFileResult = async (
  cwd: string,
  bundleConfig: BundleConfig,
  config: BundleConfigs,
): Promise<ParsedBundleConfig> => {
  const fullPath = resolvePath(cwd, config.path);
  const files = await globby(fullPath);

  if (!files.length) {
    throw new Error('No files found to check the bundle sizes');
  }

  const maxSizeBytes = bytes(config.maxSize);

  const failures: ParsedFile[] = [];
  const successes: ParsedFile[] = [];

  await Promise.all(
    files.map(
      async (file: string): Promise<ParsedFile> => {
        const source = await getFileSource(file);
        const size = getBundleSize(source, bundleConfig.compression);
        const fail = size > maxSizeBytes;
        const parsedFile: ParsedFile = {
          fail,
          path: file,
          size,
        };

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

const bundlesizeModule = async (
  cwd: string,
  bundleConfig: BundleConfig | BundleConfigs[] = Config.get('configs.bundle-size', defaultConfig),
): Promise<ParsedBundleConfig[]> => {
  if (!bundleConfig) {
    return Promise.resolve([]);
  }

  const configObject: BundleConfig = Array.isArray(bundleConfig) ? { configs: bundleConfig } : bundleConfig;

  return Promise.all(
    configObject.configs.map(
      (config: BundleConfigs): Promise<ParsedBundleConfig> => getFileResult(cwd, configObject, config),
    ),
  );
};

export default bundlesizeModule;
