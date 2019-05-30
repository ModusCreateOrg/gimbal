import { SizeConfigs } from '@/typings/module/size';
import { UnusedSourceConfig } from '@/typings/module/unused-source';

const defaultConfig: UnusedSourceConfig = {
  /**
   * A `threshold` value can be a number or string or an array of size thresholds:
   *
   * If a string, `n%` Will check based on unused percentage where n is a number like `30%`.
   */
  threshold: [
    {
      maxSize: '35%',
      path: '**/*/*.css',
    },
    {
      maxSize: '3%',
      path: '**/*/main.*.js',
    },
    {
      maxSize: '70%',
      path: '**/*.js',
    },
    {
      maxSize: '30%',
      path: '/',
      type: 'js',
    },
    {
      maxSize: '65%',
      path: '/',
    },
  ] as SizeConfigs[],
  // Examples:

  // The array of objects, the path is relative to the base url. If the url is `http://localhost/foo/bar.js`
  // then `/foo/bar.js` will be used to find a matching threshold based on the `path` within the object:
  // threshold: [
  //   {
  //     maxSize: '50%',
  //     path: '**/*/*.css',
  //     type: 'css', // optional
  //   },
  //   {
  //     maxSize: '50%',
  //     path: '**/*/*.js',
  //     type: 'js', // optional
  //   },
  //   {
  //     maxSize: '50%',
  //     path: '/'
  //   }
  // ],
};

export default defaultConfig;
