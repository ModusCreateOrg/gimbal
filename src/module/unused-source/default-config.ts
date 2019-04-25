import { UnusedSourceConfig } from '@/typings/module/unused-source';

const defaultConfig: UnusedSourceConfig = {
  /**
   * A `threshold` value can be a number or string or an array of size thresholds:
   *
   * If a string, `n%` Will check based on unused percentage where n is a number like `30%`.
   */
  threshold: '30%',
  // Examples:

  // The array of objects, the path is relative to the base url. If the url is `http://localhost/foo/bar.js`
  // then `/foo/bar.js` will be used to find a matching threshold based on the `path` within the object:
  // threshold: [
  //   {
  //     maxSize: 800,
  //     path: '**/*/*.css',
  //     type: 'js', // optional
  //   },
  //   {
  //     maxSize: '50%',
  //     path: '**/*/*.js',
  //     type: 'js', // optional
  //   },
  //   {
  //     maxSize: '100 B',
  //     path: '/'
  //   }
  // ],
};

export default defaultConfig;
