import { resolvePath } from '@modus/gimbal-core/lib/utils/fs';
import { Context } from '@/typings/context';
import { SizeConfig } from '@/typings/module/size';

const defaultConfig = (context: Context): SizeConfig => {
  const buildDir = context.config.get('configs.buildDir');

  return {
    threshold: [
      {
        path: resolvePath(buildDir, 'static/css/main.*.chunk.css'),
        maxSize: '5 KB',
      },
      {
        path: resolvePath(buildDir, 'static/js/main.*.chunk.js'),
        maxSize: '5 KB',
      },
      {
        path: resolvePath(buildDir, 'static/js/*.chunk.js'),
        maxSize: '150 KB',
      },
      {
        path: resolvePath(buildDir, 'static/js/runtime*.js'),
        maxSize: '5 KB',
      },
      {
        path: resolvePath(buildDir, 'static/media/logo*.svg'),
        maxSize: '3 KB',
      },
      {
        path: resolvePath(buildDir, 'favicon.ico'),
        maxSize: '4 KB',
      },
      {
        path: resolvePath(buildDir, 'index.html'),
        maxSize: '3 KB',
      },
      {
        path: resolvePath(buildDir, 'manifest.json'),
        maxSize: '500 B',
      },
      {
        path: resolvePath(buildDir, 'precache-*.js'),
        maxSize: '1 KB',
      },
      {
        path: resolvePath(buildDir, 'service-worker.js'),
        maxSize: '1.2 KB',
      },
      {
        path: buildDir,
        maxSize: '500 KB',
      },
    ],
  };
};

export default defaultConfig;
