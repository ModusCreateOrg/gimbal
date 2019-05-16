// @ts-ignore
import brotliSize from 'brotli-size';
import bytes from 'bytes';
import globby from 'globby';
import gzipSize from 'gzip-size';
import Config from '@/config';
import EventEmitter from '@/event';
import { Report } from '@/typings/command';
import {
  SizeConfig,
  SizeConfigs,
  ParsedSizeConfig,
  ParsedFile,
  AuditStartEvent,
  AuditEndEvent,
  CheckStartEvent,
  CheckEndEvent,
  ItemCheckEvent,
  ReportStartEvent,
  ReportEndEvent,
} from '@/typings/module/size';
import { CommandOptions } from '@/typings/utils/command';
import { readFile, resolvePath, stats, getDirectorySize } from '@/utils/fs';
import defaultConfig from './default-config';
import parseReport from './output';

type CompressionMechanisms = 'brotli' | 'gzip' | undefined;

const getBundleSize = (source: Buffer, compression: CompressionMechanisms = 'gzip'): number => {
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

const getFileResult = async (
  cwd: string,
  sizeConfig: SizeConfig,
  config: SizeConfigs,
  options: CommandOptions,
): Promise<ParsedSizeConfig> => {
  const { checkThresholds } = options;
  const fullPath = resolvePath(cwd, config.path);
  const paths = await globby(fullPath, { expandDirectories: false, onlyFiles: false });
  const { maxSize: threshold } = config;
  const maxSizeBytes = bytes(threshold);
  const failures: ParsedFile[] = [];
  const successes: ParsedFile[] = [];

  const checkStartEvent: CheckStartEvent = {
    config,
    fullPath,
    options,
    maxSizeBytes,
    paths,
    sizeConfig,
  };

  await EventEmitter.fire(`module/size/check/start`, checkStartEvent);

  await Promise.all(
    paths.map(
      async (path: string): Promise<ParsedFile> => {
        const pathStats = await stats(path);
        const isDirectory = pathStats.isDirectory();
        const size: number = isDirectory ? await getDirSize(path) : await getFileSize(path, sizeConfig.compression);
        const fail = checkThresholds ? size > maxSizeBytes : false;
        const parsedFile: ParsedFile = { fail, path, size, threshold };

        if (fail) {
          failures.push(parsedFile);
        } else {
          successes.push(parsedFile);
        }

        const itemChecKEvent: ItemCheckEvent = {
          config,
          fail,
          options,
          maxSizeBytes,
          parsedFile,
          path,
          sizeConfig,
          size,
        };

        await EventEmitter.fire(`module/size/check/${isDirectory ? 'dir' : 'file'}`, itemChecKEvent);

        return parsedFile;
      },
    ),
  );

  const checkEndEvent: CheckEndEvent = {
    config,
    failures,
    fullPath,
    options,
    maxSizeBytes,
    paths,
    sizeConfig,
    successes,
  };

  await EventEmitter.fire(`module/size/check/end`, checkEndEvent);

  return {
    ...config,
    failures,
    fullPath,
    maxSizeBytes,
    successes,
  };
};

const sizeModule = async (
  options: CommandOptions,
  sizeConfig: SizeConfig | SizeConfigs[] = Config.get('configs.size', defaultConfig),
): Promise<Report> => {
  if (!sizeConfig) {
    return Promise.resolve({
      data: [],
      success: true,
    });
  }

  const { cwd } = options;

  const configObject: SizeConfig = Array.isArray(sizeConfig) ? { threshold: sizeConfig } : sizeConfig;

  const auditStartEvent: AuditStartEvent = {
    config: configObject,
    options,
  };

  await EventEmitter.fire(`module/size/audit/start`, auditStartEvent);

  const audit: ParsedSizeConfig[] = await Promise.all(
    configObject.threshold.map(
      (config: SizeConfigs): Promise<ParsedSizeConfig> => getFileResult(cwd, configObject, config, options),
    ),
  );

  const auditEndEvent: AuditEndEvent = {
    audit,
    config: configObject,
    options,
  };

  await EventEmitter.fire(`module/size/audit/end`, auditEndEvent);

  const reportStartEvent: ReportStartEvent = {
    audit,
    config: configObject,
    options,
  };

  await EventEmitter.fire(`module/size/report/start`, reportStartEvent);

  const report = parseReport(audit, options);

  const reportEndEvent: ReportEndEvent = {
    audit,
    config: configObject,
    options,
    report,
  };

  await EventEmitter.fire(`module/size/report/end`, reportEndEvent);

  return report;
};

export default sizeModule;
