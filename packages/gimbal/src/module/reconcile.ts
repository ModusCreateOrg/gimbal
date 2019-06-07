import { ReportItem } from '@/typings/command';
import HeapSnapshotReconcile from './heap-snapshot/reconcile';
import LighthouseReconcile from './lighthouse/reconcile';
import UnusedSourceReconcile from './unused-source/reconcile';

const reconcile = (matches: ReportItem[], type: string): ReportItem => {
  switch (type) {
    case 'heap-snapshot':
      return HeapSnapshotReconcile(matches);
    case 'lighthouse':
      return LighthouseReconcile(matches);
    case 'unused-source':
      return UnusedSourceReconcile(matches);
    default:
      // cannot reconcile
      // maybe we can do some default reconciliation?
      return matches[0];
  }
};

export default reconcile;
