import { UnusedSourceConfig } from '@/typings/module/unused-source';

const defaultConfig: UnusedSourceConfig = {
  /**
   * `threshold` can accept a number or string:
   *
   * - If a number, will be assumed to be number of bytes.
   * - If a string, can be two different formats:
   *  - `n%` Will check based on unused percentage where n is a number like `30%`.
   *  - `10 KB` Will parse using bytes module to get the number of bytes to compare to.
   */
  threshold: '30%',
};

export default defaultConfig;
