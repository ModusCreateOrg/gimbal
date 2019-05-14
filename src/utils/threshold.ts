type Modes = 'lower' | 'upper';

const PERCENTAGE_RE = /^(\d+(?:\.\d+)?)\s*%$/;

export const isPercentage = (value: number | string): boolean => String(value).match(PERCENTAGE_RE) != null;
export const percentToNumber = (value: string): number => Number(value.replace(PERCENTAGE_RE, '$1'));

const checkValue = (value: number, threshold: number, mode: Modes): boolean =>
  mode === 'lower'
    ? value >= threshold // lower means value should be above or equal to the threshold
    : value <= threshold; // upper mode means value should be below or equal to the threshold

const checkPercentage = (raw: string, rawThreshold: string, mode: Modes): boolean => {
  const threshold = percentToNumber(rawThreshold);
  const value = percentToNumber(raw);

  return checkValue(value, threshold, mode);
};

const checkThreshold = (value: number | string, threshold: number | string, mode: Modes = 'upper'): boolean =>
  isPercentage(value)
    ? checkPercentage(value as string, threshold as string, mode)
    : checkValue(value as number, threshold as number, mode);

export default checkThreshold;
