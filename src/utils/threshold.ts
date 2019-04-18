import { AdvancedThreshold, Modes, Options } from '@/typings/utils/threshold';

const modeChecker = (value: number, threshold: number, mode?: Modes): boolean =>
  mode === 'above' ? value < threshold : value > threshold;

/* eslint-disable-next-line @typescript-eslint/no-explicit-any */
const checkThresholds = (obj: any, threshold?: number | AdvancedThreshold, options?: Options): boolean => {
  if (threshold == null) {
    return true;
  }

  let i = 0;
  const mode = options && options.mode;
  const parser = options && options.parser;
  const keys = Object.keys(obj).sort();
  const { length } = keys;

  while (i < length) {
    const key = keys[i];
    const value = obj[key];
    const parsedValue = parser ? parser(value) : value;
    const thresholdNumber: number = (typeof threshold === 'object'
      ? (threshold as AdvancedThreshold)[key]
      : threshold) as number;

    if (modeChecker(parsedValue, thresholdNumber, mode)) {
      return false;
    }

    i += 1;
  }

  return true;
};

export default checkThresholds;
