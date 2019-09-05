import { resolvePath } from '@modus/gimbal-core/lib/utils/fs';
import { SizeConfig } from '@/typings/module/size';
import { CommandOptions } from '@/typings/utils/command';

const defaultConfig = ({ cwd, buildDir }: CommandOptions): SizeConfig => {
  const resolvedBuildDir = resolvePath(cwd, buildDir as string);

  return {
    threshold: [
      {
        path: resolvePath(resolvedBuildDir, 'static/css/main.*.chunk.css'),
        maxSize: '5 KB',
      },
      {
        path: resolvePath(resolvedBuildDir, 'static/js/main.*.chunk.js'),
        maxSize: '5 KB',
      },
      {
        path: resolvePath(resolvedBuildDir, 'static/js/*.chunk.js'),
        maxSize: '150 KB',
      },
      {
        path: resolvePath(resolvedBuildDir, 'static/js/runtime*.js'),
        maxSize: '5 KB',
      },
      {
        path: resolvePath(resolvedBuildDir, 'static/media/logo*.svg'),
        maxSize: '3 KB',
      },
      {
        path: resolvePath(resolvedBuildDir, 'favicon.ico'),
        maxSize: '4 KB',
      },
      {
        path: resolvePath(resolvedBuildDir, 'index.html'),
        maxSize: '3 KB',
      },
      {
        path: resolvePath(resolvedBuildDir, 'manifest.json'),
        maxSize: '500 B',
      },
      {
        path: resolvePath(resolvedBuildDir, 'precache-*.js'),
        maxSize: '1 KB',
      },
      {
        path: resolvePath(resolvedBuildDir, 'service-worker.js'),
        maxSize: '1.2 KB',
      },
      {
        path: resolvedBuildDir,
        maxSize: '500 KB',
      },
    ],
  };
};

export default defaultConfig;
