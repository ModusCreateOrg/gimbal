// @ts-ignore
import brotliSize from 'brotli-size';
import bytes from 'bytes';
import globby from 'globby';
import gzipSize from 'gzip-size';
import { BundleConfig, BundleConfigs, ParsedBundleConfig, ParsedFile } from '@/typings/module/bundlesize';
import { readFile, resolvePath } from '@/utils/fs';

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

  const completeFiles = await Promise.all(
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
    files: completeFiles,
    fullPath,
    maxSizeBytes,
    successes,
  };
};

const bundlesizeModule = async (cwd: string, bundleConfig: BundleConfig): Promise<ParsedBundleConfig[]> =>
  Promise.all(
    bundleConfig.configs.map(
      (config: BundleConfigs): Promise<ParsedBundleConfig> => getFileResult(cwd, bundleConfig, config),
    ),
  );

export default bundlesizeModule;
