import { SizeConfig } from '@/typings/module/size';

const defaultConfig: SizeConfig = {
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

export default defaultConfig;
