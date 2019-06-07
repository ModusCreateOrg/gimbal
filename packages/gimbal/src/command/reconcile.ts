import deepmerge from 'deepmerge';
import reconcile from '@/module/reconcile';
import { Report, ReportItem } from '@/typings/command';

const findMatches = (item: ReportItem, type: string, rest: Report[]): ReportItem[] => {
  const matches: ReportItem[] = [item];

  rest.forEach((report: Report): void => {
    if (report.data) {
      report.data.forEach((reportItem: ReportItem): void => {
        if (reportItem.data && reportItem.type === type) {
          reportItem.data.forEach((reportDataItem: ReportItem): void => {
            // need a better way as these may be the same on different things
            // unused source root path (http://localhost:3000/) may have different
            // types or be the page total. This would work if the threshold is
            // different but could be the same...
            if (reportDataItem.rawLabel === item.rawLabel && reportDataItem.rawThreshold === item.rawThreshold) {
              matches.push(reportDataItem);
            }
          });
        }
      });
    }
  });

  return matches;
};

const reconcileReports = (reports: Report | Report[]): Report => {
  if (Array.isArray(reports)) {
    const [first, ...rest] = reports;
    const cloned: Report = deepmerge(first, {});

    // clone the reports prior to reconciling so that they are unchanged
    first.rawReports = reports;

    if (cloned.data) {
      cloned.data.forEach((report: ReportItem): void => {
        if (report.data) {
          // .map() creates a new array instance, make sure to poke it onto the report
          /* eslint-disable-next-line no-param-reassign */
          report.data = report.data.map(
            (item: ReportItem): ReportItem => {
              const matches = findMatches(item, report.type, rest);

              return reconcile(matches, report.type);
            },
          );

          /* eslint-disable-next-line no-param-reassign */
          report.success = report.data.every((item: ReportItem): boolean => item.success);
        }
      });

      cloned.success = cloned.data.every((item: ReportItem): boolean => item.success);
    }

    return cloned;
  }

  return reports;
};

export default reconcileReports;
