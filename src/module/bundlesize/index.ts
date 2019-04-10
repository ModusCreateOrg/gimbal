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

  const completeFiles = await Promise.all(
    files.map(
      async (file: string): Promise<ParsedFile> => {
        const source = await getFileSource(file);
        const size = getBundleSize(source, bundleConfig.compression);

        return {
          fail: size > maxSizeBytes,
          path: file,
          size,
          source,
        };
      },
    ),
  );

  return {
    ...config,
    files: completeFiles,
    fullPath,
    maxSizeBytes,
  };
};

const bundlesizeModule = async (cwd: string, bundleConfig: BundleConfig): Promise<ParsedBundleConfig[]> => {
  const results = await Promise.all(
    bundleConfig.configs.map(
      (config: BundleConfigs): Promise<ParsedBundleConfig> => getFileResult(cwd, bundleConfig, config),
    ),
  );

  return results
    .map(
      (config: ParsedBundleConfig): ParsedBundleConfig => ({
        ...config,
        files: config.files.filter((file: ParsedFile): boolean => file.fail),
      }),
    )
    .filter((config: ParsedBundleConfig): boolean => config.files.length > 0);
};

export default bundlesizeModule;
