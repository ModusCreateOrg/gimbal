import { Report, ReportItem } from '@/typings/command';

export const filterReportItemsFailures = (item: ReportItem): ReportItem | undefined => {
  if (item.success) {
    return undefined;
  }

  if (item.data) {
    // recursive
    const data = item.data.map(filterReportItemsFailures).filter(Boolean) as ReportItem[];

    return {
      ...item,
      data,
    };
  }

  return item;
};

export const returnReportFailures = (report: Report | ReportItem): Report => {
  if (report.data) {
    const data = report.data.map(filterReportItemsFailures).filter(Boolean) as ReportItem[];

    return {
      ...report,
      data,
    };
  }

  return report;
};
