import { ReportItem } from '@/typings/command';
import { checkThreshold, getEntryUsed } from './index';

interface Range {
  end: number;
  start: number;
}

const mergeRanges = (source: Range[], ranges: Range[]): Range[] => {
  ranges.forEach(({ start, end }: Range): void => {
    let foundMatch = false;
    let needSort = true;

    source.forEach((range: Range): void => {
      if (start >= range.start && end <= range.end) {
        // if start and end are within a range, skip doing anything

        foundMatch = true;
        needSort = false;
      } else if (start >= range.start && start <= range.end && end > range.end) {
        // if start is within the range and end is not

        /* eslint-disable-next-line no-param-reassign */
        range.end = end;

        foundMatch = true;
      } else if (end <= range.end && end >= range.start && start < range.start) {
        // if end is within the range but start is not

        /* eslint-disable-next-line no-param-reassign */
        range.start = start;

        foundMatch = true;
      }
    });

    if (!foundMatch) {
      // wasn't in a range so add it
      source.push({ start, end });
    }

    if (needSort) {
      // sort by start points to keep it in order
      source.sort((A: Range, B: Range): 0 | 1 | -1 => {
        if (A.start < B.start) {
          return -1;
        }

        if (A.start > B.start) {
          return 1;
        }

        return 0;
      });
    }
  });

  return source;
};

const removeOverlaps = (source: Range[]): Range[] =>
  source
    .map((range: Range, index: number, ranges: Range[]): Range | undefined => {
      const last = ranges[index - 1];

      if (last) {
        if (range.start >= last.start && range.end <= last.end) {
          // if start and end are within a range, skip doing anything

          return undefined;
        }

        if (range.start >= last.start && range.start <= last.end && range.end > last.end) {
          // if start is within the range and end is not
          last.end = range.end;

          return undefined;
        }

        if (range.end <= last.end && range.end >= last.start && range.start < last.start) {
          // if end is within the range but start is not
          last.start = range.start;

          return undefined;
        }
      }

      return range;
    })
    .filter(Boolean) as Range[];

const reconcile = (matches: ReportItem[]): ReportItem => {
  const [first, ...rest] = matches;

  if (rest.length) {
    const item: ReportItem = {
      ...first,
    };

    if (item.raw && item.raw.rawEntry) {
      const ranges = removeOverlaps(
        rest.reduce(
          (range: Range[], currentItem: ReportItem): Range[] => mergeRanges(range, currentItem.raw.rawEntry.ranges),
          item.raw.rawEntry.ranges,
        ),
      );

      item.raw.rawEntry.ranges = ranges;

      const used = getEntryUsed(item.raw.rawEntry);
      const unused = item.raw.total - used;
      const percentage = (unused / item.raw.total) * 100;
      const { success } = item.rawThreshold
        ? checkThreshold(percentage, item.rawThreshold as string)
        : { success: true };

      item.raw.unused = unused;
      item.raw.unusedPercentage = `${percentage.toFixed(2)}%`;

      item.rawValue = item.raw.unusedPercentage;
      item.value = item.raw.unusedPercentage;

      item.success = success;
    }

    return item;
  }

  return first;
};

export default reconcile;
