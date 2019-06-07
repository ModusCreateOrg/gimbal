import checkThreshold from '@modus/gimbal-core/lib/utils/threshold';
import { ReportItem } from '@/typings/command';

const reconcile = (matches: ReportItem[]): ReportItem => {
  const [first] = matches;

  if (matches.length > 1) {
    const item: ReportItem = {
      ...first,
    };
    const totalScore = matches.reduce(
      (last: number, match: ReportItem): number => (match.rawValue as number) + last,
      0,
    );
    const averageScore = totalScore / matches.length; // get average
    const value = averageScore * 100;

    item.rawValue = averageScore;
    item.value = value.toFixed(0);
    item.success = item.rawThreshold == null || checkThreshold(value, item.rawThreshold as number, 'lower');

    return item;
  }

  return first;
};

export default reconcile;
