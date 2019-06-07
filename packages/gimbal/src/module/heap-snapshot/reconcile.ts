import checkThreshold from '@modus/gimbal-core/lib/utils/threshold';
import { ReportItem } from '@/typings/command';

const reconcile = (matches: ReportItem[]): ReportItem => {
  const [first] = matches;

  if (matches.length > 1) {
    const item: ReportItem = {
      ...first,
    };
    const number = matches.reduce((last: number, match: ReportItem): number => (match.rawValue as number) + last, 0);
    const value = number / matches.length; // get average

    item.rawValue = value;
    item.value = value.toFixed(0);
    item.success = item.rawThreshold == null || checkThreshold(value, item.rawThreshold);

    return item;
  }

  return first;
};

export default reconcile;
