import { SizeConfig } from '@/typings/module/size';

const defaultConfig: SizeConfig = {
  threshold: [
    {
      path: './build/static/css/main.*.chunk.css',
      maxSize: '5 KB',
    },
    {
      path: './build/static/js/main.*.chunk.js',
      maxSize: '5 KB',
    },
    {
      path: './build/static/js/*.chunk.js',
      maxSize: '150 KB',
    },
    {
      path: './build/static/js/runtime*.js',
      maxSize: '5 KB',
    },
    {
      path: './build/static/media/logo*.svg',
      maxSize: '3 KB',
    },
    {
      path: './build/favicon.ico',
      maxSize: '4 KB',
    },
    {
      path: './build/index.html',
      maxSize: '3 KB',
    },
    {
      path: './build/manifest.json',
      maxSize: '500 B',
    },
    {
      path: './build/precache-*.js',
      maxSize: '1 KB',
    },
    {
      path: './build/service-worker.js',
      maxSize: '1.2 KB',
    },
    {
      path: './build/',
      maxSize: '500 KB',
    },
  ],
};

export default defaultConfig;
